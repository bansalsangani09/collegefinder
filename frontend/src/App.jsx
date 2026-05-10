import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetail from './pages/CollegeDetail';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Register from './pages/Register';
import Saved from './pages/Saved';
import Predictor from './pages/Predictor';
import QnA from './pages/QnA';
import AdminDashboard from './pages/AdminDashboard';
import CollegeForm from './pages/CollegeForm';
import AdminRoute from './components/AdminRoute';

import CompareBar from './components/CompareBar';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CompareProvider>
          <div className="flex flex-col min-h-screen bg-white text-slate-950">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/colleges/:id" element={<CollegeDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/predictor" element={<Predictor />} />
                <Route path="/qna" element={<QnA />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/saved" element={
                  <ProtectedRoute><Saved /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute><AdminDashboard /></AdminRoute>
                } />
                <Route path="/admin/add" element={
                  <AdminRoute><CollegeForm /></AdminRoute>
                } />
                <Route path="/admin/edit/:id" element={
                  <AdminRoute><CollegeForm /></AdminRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>

          <CompareBar />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#0f172a',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              },
              success: { iconTheme: { primary: '#6366f1', secondary: '#ffffff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#ffffff' } },
            }}
          />
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
