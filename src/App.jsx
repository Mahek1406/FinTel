import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DataUploadPage from './pages/DataUploadPage.jsx';
import ProcessingComparisonPage from './pages/ProcessingComparisonPage.jsx';
import VisualizationPage from './pages/VisualizationPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import SecurityModulePage from './pages/SecurityModulePage.jsx';
import CaseManagementPage from './pages/CaseManagementPage.jsx';
import RulesLabPage from './pages/RulesLabPage.jsx';
import MarketPage from './pages/MarketPage.jsx';
import StocksPage from './pages/StocksPage.jsx';
import StockDetailPage from './pages/StockDetailPage.jsx';
import IPOPage from './pages/IPOPage.jsx';
import ScreenerPage from './pages/ScreenerPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import LearnPage from './pages/LearnPage.jsx';
import AdminRiskCommandCenterPage from './pages/AdminRiskCommandCenterPage.jsx';

function AppRoutes(){const {currentUser}=useAuth();return <BrowserRouter><Toaster position="top-right" toastOptions={{duration:2800,style:{background:'#0f151c',color:'#dbe4ee',border:'1px solid rgba(255,255,255,.08)'}}}/><ErrorBoundary><Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/signup" element={<SignupPage/>}/><Route element={<ProtectedRoute><Layout/></ProtectedRoute>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/upload" element={<DataUploadPage/>}/><Route path="/processing" element={<ProcessingComparisonPage/>}/><Route path="/visualization" element={<VisualizationPage/>}/><Route path="/insights" element={<VisualizationPage/>}/><Route path="/history" element={<HistoryPage/>}/><Route path="/security" element={<SecurityModulePage/>}/><Route path="/cases" element={<CaseManagementPage/>}/><Route path="/rules" element={<RulesLabPage/>}/><Route path="/market" element={<MarketPage/>}/><Route path="/stocks" element={<StocksPage/>}/><Route path="/stocks/:symbol" element={<StockDetailPage/>}/><Route path="/ipos" element={<IPOPage/>}/><Route path="/screener" element={<ScreenerPage/>}/><Route path="/portfolio" element={<PortfolioPage/>}/><Route path="/learn" element={<LearnPage/>}/><Route path="/admin/risk" element={<AdminRiskCommandCenterPage/>}/></Route><Route path="*" element={<Navigate to={currentUser?'/dashboard':'/login'} replace/>}/></Routes></ErrorBoundary></BrowserRouter>}
export default function App(){return <AuthProvider><DataProvider><AppRoutes/></DataProvider></AuthProvider>}
