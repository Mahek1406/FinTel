import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dataDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'data');
const dataFile = path.join(dataDirectory, 'fintel.json');
let state;
let writeQueue = Promise.resolve();

const clone = (value) => JSON.parse(JSON.stringify(value));
const id = () => crypto.randomUUID();
const same = (left, right) => String(left) === String(right);

const matches = (document, filter = {}) => Object.entries(filter).every(([key, expected]) => {
  const actual = document[key];
  if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
    if ('$ne' in expected) return !same(actual, expected.$ne);
    if ('$in' in expected) return expected.$in.some((value) => same(actual, value));
  }
  return same(actual, expected);
});

const persist = () => {
  writeQueue = writeQueue.then(() => fs.writeFile(dataFile, JSON.stringify(state, null, 2)));
  return writeQueue;
};

const decorate = (document, collection) => {
  if (!document) return document;
  const result = { ...document };
  result.toObject = () => {
    const plain = { ...result };
    delete plain.toObject;
    delete plain.save;
    return clone(plain);
  };
  result.save = async () => {
    const index = state[collection].findIndex((item) => same(item._id, result._id));
    if (index === -1) throw new Error('Document no longer exists.');
    result.updatedAt = new Date().toISOString();
    const plain = result.toObject();
    state[collection][index] = plain;
    Object.assign(result, plain);
    await persist();
    return result;
  };
  return result;
};

class Query {
  constructor(run) {
    this.run = run;
    this.operations = [];
  }
  sort(order) { this.operations.push({ type: 'sort', order }); return this; }
  limit(count) { this.operations.push({ type: 'limit', count }); return this; }
  select(fields) { this.operations.push({ type: 'select', fields }); return this; }
  populate(pathName, fields) { this.operations.push({ type: 'populate', pathName, fields }); return this; }
  async exec() {
    let value = await this.run();
    for (const operation of this.operations) {
      if (operation.type === 'sort' && Array.isArray(value)) {
        const [field, direction] = Object.entries(operation.order)[0];
        value.sort((a, b) => (a[field] < b[field] ? direction : a[field] > b[field] ? -direction : 0));
      }
      if (operation.type === 'limit' && Array.isArray(value)) value = value.slice(0, operation.count);
      if (operation.type === 'select' && value) {
        const include = operation.fields.split(' ').filter((field) => !field.startsWith('-')).map((field) => field.replace(/^\+/, ''));
        if (include.length) {
          const selected = Object.fromEntries(include.filter((field) => field in value).map((field) => [field, value[field]]));
          if ('_id' in value) selected._id = value._id;
          value = decorate(selected, null);
        }
      }
      if (operation.type === 'populate' && Array.isArray(value) && operation.pathName === 'user') {
        value = value.map((item) => {
          const user = state.users.find((candidate) => same(candidate._id, item.user));
          return { ...item, user: user ? { name: user.name, email: user.email } : null };
        });
      }
    }
    return value;
  }
  then(resolve, reject) { return this.exec().then(resolve, reject); }
  catch(reject) { return this.exec().catch(reject); }
}

export const createModel = (collection) => ({
  create: async (input) => {
    const now = new Date().toISOString();
    const defaults = {
      users: { role: 'user', isPremium: false },
      uploads: { riskReviews: [] },
      cases: { priority: 'medium', status: 'open', assignedTo: '', transactions: [], notes: '', timeline: [], evidence: [] },
      rules: { description: '', action: 'flag', enabled: false },
      complaints: { priority: 'medium', status: 'pending', reply: '' },
    };
    const document = { _id: id(), createdAt: now, updatedAt: now, ...(defaults[collection] || {}), ...clone(input) };
    if (collection === 'cases' && !document.caseNumber) document.caseNumber = `FS-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    state[collection].push(document);
    await persist();
    return decorate(document, collection);
  },
  find: (filter = {}) => new Query(async () => state[collection].filter((item) => matches(item, filter)).map((item) => decorate(item, collection))),
  findOne: (filter = {}) => new Query(async () => decorate(state[collection].find((item) => matches(item, filter)), collection)),
  findById: (documentId) => new Query(async () => decorate(state[collection].find((item) => same(item._id, documentId)), collection)),
  exists: async (filter = {}) => state[collection].some((item) => matches(item, filter)),
  countDocuments: async (filter = {}) => state[collection].filter((item) => matches(item, filter)).length,
  findOneAndUpdate: (filter, updates, options = {}) => new Query(async () => {
    let document = state[collection].find((item) => matches(item, filter));
    if (!document && options.upsert) {
      document = { _id: id(), createdAt: new Date().toISOString(), ...clone(updates) };
      state[collection].push(document);
    } else if (document) Object.assign(document, clone(updates));
    if (!document) return null;
    document.updatedAt = new Date().toISOString();
    await persist();
    return decorate(document, collection);
  }),
  findByIdAndUpdate: (documentId, updates) => new Query(async () => {
    const document = state[collection].find((item) => same(item._id, documentId));
    if (!document) return null;
    Object.assign(document, clone(updates), { updatedAt: new Date().toISOString() });
    await persist();
    return decorate(document, collection);
  }),
});

export const connectDatabase = async () => {
  await fs.mkdir(dataDirectory, { recursive: true });
  try {
    state = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    state = { users: [], uploads: [], cases: [], rules: [], complaints: [] };
    await persist();
  }
};
