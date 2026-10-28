import { Component } from 'react';
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() { if (!this.state.error) return this.props.children; return <div className="min-h-screen grid place-items-center bg-[#090d12] p-6 text-center"><div className="panel max-w-xl p-8"><h1 className="text-lg font-semibold">Something went wrong</h1><p className="mt-2 text-sm text-slate-500">{this.state.error?.message || 'Unexpected application error.'}</p><button className="button-primary mt-5" onClick={() => window.location.reload()}>Reload</button></div></div>; }
}
