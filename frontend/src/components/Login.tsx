import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Lock, Mail, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {

  const { login } = useAuth();
  const [email, setEmail] = useState('alice@acme.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      await login(email, password);

    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-logo">
            <FileText size={28} color="#2563eb" />
          </div>
          <h2>Document Workspace</h2>
          <p>Sign in to your organization tenant</p>
        </div>

        {error && (
          <div className="alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@firm.com"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn primary full-width" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

        </form>

        <div className="auth-footer">
          <p>Test Accounts:</p>
          <code>test1@offerzen.com</code> (Offerzen Accounting)<br />
          <code>test2@offerzen.com</code> (Adam Finance)<br />
          <small>Password: <code>password123</code></small>
        </div>

      </div>

    </div>
  );
};