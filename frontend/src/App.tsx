import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { DocumentList } from './components/DocumentList';
import { FileText, LogOut } from 'lucide-react';
import './App.css';

const MainLayout: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (

    <div>

      <nav className="navbar">

        <div className="brand">
          <FileText color="#2563eb" />
          <span>DocuFin Workspace</span>
        </div>

        <div className="user-badge">
          
          <span className="tenant-pill">Tenant ID: {user?.tenantId.slice(0, 8)}...</span>
          <span>{user?.email}</span>

          <button onClick={logout} className="btn outline">
            <LogOut size={16} /> Sign Out
          </button>

        </div>

      </nav>
      <DocumentList />

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;