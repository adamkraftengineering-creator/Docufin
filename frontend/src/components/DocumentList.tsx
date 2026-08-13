import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Document, DocumentStatus } from '../types';
import { Search, Plus, FileText, CheckCircle2, Clock, FileEdit, AlertCircle, RefreshCw } from 'lucide-react';

export const DocumentList: React.FC = () => {

  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDocuments = useCallback(async (query?: string) => {

    try {

      setLoading(true);
      setError(null);
      const data = await api.getDocuments(query);
      setDocuments(data);

    } catch (err: any) {
      setError(err.message || 'Failed to load documents');

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDocuments(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchDocuments]);

  const handleStatusChange = async (id: string, newStatus: DocumentStatus) => {

    setUpdatingId(id);

    try {

      const updated = await api.updateDocumentStatus(id, newStatus);
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === id ? updated : doc))
      );

    } catch (err: any) {
      alert(err.message || 'Failed to update status');

    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!newTitle.trim()) return;

    try {

      setIsCreating(true);
      const newDoc = await api.createDocument(newTitle.trim());
      setDocuments((prev) => [newDoc, ...prev]);
      setNewTitle('');

    } catch (err: any) {
      alert(err.message || 'Failed to create document');

    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {

    switch (status) {
      case 'signed':
        return <span className="badge badge-success"><CheckCircle2 size={14} /> Signed</span>;
      case 'awaiting_signature':
        return <span className="badge badge-warning"><Clock size={14} /> Awaiting Signature</span>;
      default:
        return <span className="badge badge-neutral"><FileEdit size={14} /> Draft</span>;
    }
  };

  return (

    <div className="workspace-container">

      <div className="workspace-header">
        <div>
          <h1>Tenant Documents</h1>
          <p>Isolated document lifecycle management</p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="toolbar">

        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <form onSubmit={handleCreateDocument} className="create-form">
          <input
            type="text"
            placeholder="New document title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <button type="submit" className="btn primary" disabled={isCreating}>
            <Plus size={18} />
            {isCreating ? 'Creating...' : 'Add Document'}
          </button>
        </form>

      </div>

      {/* Feedback States */}
      {error && (
        <div className="alert error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <div className="table-card">

        {loading ? (
          <div className="state-container">
            <RefreshCw size={24} className="spin" />
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="state-container">
            <FileText size={40} className="muted-icon" />
            <h3>No documents found</h3>
            <p>Try refining your search query or create a new record.</p>
          </div>
        ) : (
          <table className="data-table">

            <thead>
              <tr>
                <th>Document Title</th>
                <th>Status</th>
                <th>Updated At</th>
                <th>Update Lifecycle State</th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>

                  <td className="title-cell">
                    <FileText size={18} className="doc-icon" />
                    <span>{doc.title}</span>
                  </td>
                  <td>{getStatusBadge(doc.status)}</td>

                  <td className="date-cell">
                    {new Date(doc.updated_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  
                  <td>
                    <select
                      className="status-select"
                      value={doc.status}
                      disabled={updatingId === doc.id}
                      onChange={(e) => handleStatusChange(doc.id, e.target.value as DocumentStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="awaiting_signature">Awaiting Signature</option>
                      <option value="signed">Signed</option>
                    </select>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>

    </div>
  );
};