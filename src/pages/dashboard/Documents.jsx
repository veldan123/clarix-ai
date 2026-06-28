import { useState, useRef } from 'react';
import { Plus, FileText, FileUp, X, ExternalLink, Trash2, RefreshCw, Search, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';
import { mockDocuments, mockChatbots } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const STATUS_MAP = {
  trained: { label: 'Trained', variant: 'success' },
  processing: { label: 'Processing', variant: 'warning' },
  error: { label: 'Error', variant: 'error' },
};

const TYPE_ICONS = { PDF: '📄', TXT: '📝', DOCX: '📃', CSV: '📊', URL: '🔗' };

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ProgressBar({ value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: '#1A1A24', borderRadius: 4, height: 4, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          style={{ height: '100%', background: '#6C63FF', borderRadius: 4 }}
        />
      </div>
      <span style={{ color: '#5A5A72', fontSize: 11, minWidth: 30 }}>{Math.round(value)}%</span>
    </div>
  );
}

export default function Documents() {
  const [docs, setDocs] = useState(mockDocuments);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [deleteDoc, setDeleteDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [uploadTab, setUploadTab] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [url, setUrl] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [assignChatbot, setAssignChatbot] = useState(mockChatbots[0]?.id || '');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [sortKey, setSortKey] = useState('uploaded');
  const [sortDir, setSortDir] = useState('desc');
  const fileRef = useRef(null);
  const { addToast } = useToast();

  const filtered = docs
    .filter(d => typeFilter === 'All' || d.type === typeFilter)
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return dir * a.name.localeCompare(b.name);
      if (sortKey === 'type') return dir * a.type.localeCompare(b.type);
      if (sortKey === 'uploaded') return dir * (new Date(a.uploaded) - new Date(b.uploaded));
      return 0;
    });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }) => sortKey === k
    ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)
    : null;

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/csv'];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|docx|csv)$/i)) {
      addToast('error', 'Unsupported file', 'Please upload PDF, TXT, DOCX, or CSV files.');
      return;
    }
    setSelectedFile(file);
  };

  const resetUpload = () => {
    setSelectedFile(null); setUrl(''); setPasteText('');
    setUploadDone(false); setUploadProgress(0); setUploadTab(0);
    setUploadOpen(false);
  };

  const doUpload = async () => {
    const name = uploadTab === 0 ? selectedFile?.name : uploadTab === 1 ? `Scraped: ${url}` : 'Pasted Text';
    if (!name) { addToast('error', 'Nothing to upload', 'Please select a file, URL, or paste text.'); return; }
    setUploading(true);
    setUploadProgress(0);

    const chatbot = mockChatbots.find(b => b.id === assignChatbot);
    const newDoc = {
      id: 'doc-' + Date.now(),
      name: uploadTab === 1 ? `Scraped: ${new URL(url.startsWith('http') ? url : 'https://' + url).hostname}` : name,
      type: uploadTab === 1 ? 'URL' : uploadTab === 2 ? 'TXT' : (selectedFile?.name.split('.').pop().toUpperCase() || 'TXT'),
      size: selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : uploadTab === 1 ? 'Web' : `${Math.round(pasteText.length / 1024 * 10) / 10} KB`,
      chatbot: chatbot?.name || 'Unassigned',
      chatbotId: assignChatbot,
      status: 'processing',
      uploaded: new Date().toISOString(),
    };
    setDocs(prev => [newDoc, ...prev]);
    resetUpload();
    addToast('info', 'Uploading...', `${newDoc.name} is being processed.`);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setDocs(prev => prev.map(d => d.id === newDoc.id ? { ...d, status: 'trained' } : d));
        addToast('success', 'Training complete!', `${newDoc.name} is ready to use.`);
        setUploading(false);
      }
    }, 400);
  };

  const deleteDoc_ = (doc) => {
    setDocs(prev => prev.filter(d => d.id !== doc.id));
    setDeleteDoc(null);
    addToast('info', 'Document deleted', `${doc.name} has been removed.`);
  };

  const retrain = (doc) => {
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'processing' } : d));
    addToast('info', 'Retraining...', `${doc.name} is being reprocessed.`);
    setTimeout(() => {
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'trained' } : d));
      addToast('success', 'Retrained!', `${doc.name} is up to date.`);
    }, 3000);
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ color: '#F0F0F5', fontSize: 16, fontWeight: 600 }}>Documents</div>
          <div style={{ color: '#5A5A72', fontSize: 13 }}>{docs.length} documents across all chatbots</div>
        </div>
        <Button onClick={() => setUploadOpen(true)}><Plus size={15} /> Upload Document</Button>
      </div>

      {/* Security notice */}
      <div style={{
        background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: 8, padding: '10px 14px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 10,
        color: '#38BDF8', fontSize: 13,
      }}>
        <AlertCircle size={15} style={{ flexShrink: 0 }} />
        Your documents are encrypted at rest and never shared with other customers or used to train external AI models.
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5A5A72' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
            style={{ width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '8px 12px 8px 32px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{
          background: '#111118', border: '1px solid #2A2A38', borderRadius: 6,
          color: '#9090A8', padding: '8px 12px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
        }}>
          {['All', 'PDF', 'TXT', 'DOCX', 'CSV', 'URL'].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No documents found" description="Upload your first document to start training your AI chatbot."
          action={() => setUploadOpen(true)} actionLabel="Upload Document" />
      ) : (
        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2A2A38' }}>
                {[
                  { key: 'name', label: 'Name' },
                  { key: 'type', label: 'Type' },
                  { key: null, label: 'Size' },
                  { key: null, label: 'Chatbot' },
                  { key: null, label: 'Status' },
                  { key: 'uploaded', label: 'Uploaded' },
                  { key: null, label: '' },
                ].map(({ key, label }) => (
                  <th key={label} onClick={key ? () => toggleSort(key) : undefined}
                    style={{
                      padding: '12px 16px', color: '#3A3A4E', fontSize: 11, fontWeight: 600,
                      textAlign: 'left', cursor: key ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {label} <SortIcon k={key} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #0D0D14' }}>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{TYPE_ICONS[doc.type] || '📄'}</span>
                      <span style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{doc.name}</span>
                    </div>
                    {doc.errorMessage && (
                      <div style={{ color: '#EF4444', fontSize: 11, marginTop: 4, marginLeft: 28 }}>{doc.errorMessage}</div>
                    )}
                  </td>
                  <td style={{ padding: '13px 16px', color: '#5A5A72', fontSize: 12 }}>{doc.type}</td>
                  <td style={{ padding: '13px 16px', color: '#5A5A72', fontSize: 12 }}>{doc.size}</td>
                  <td style={{ padding: '13px 16px', color: '#9090A8', fontSize: 12 }}>{doc.chatbot}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <Badge variant={STATUS_MAP[doc.status]?.variant}>{STATUS_MAP[doc.status]?.label}</Badge>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#5A5A72', fontSize: 12 }}>{formatDate(doc.uploaded)}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => setViewDoc(doc)} aria-label="View document" title="View"
                        style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 12 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#F0F0F5'; e.currentTarget.style.borderColor = '#6C63FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
                      >
                        <ExternalLink size={12} />
                      </button>
                      <button onClick={() => retrain(doc)} aria-label="Retrain document" title="Re-train"
                        style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 12 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#F0F0F5'; e.currentTarget.style.borderColor = '#6C63FF'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
                      >
                        <RefreshCw size={12} />
                      </button>
                      <button onClick={() => setDeleteDoc(doc)} aria-label="Delete document" title="Delete"
                        style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 12 }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.borderColor = '#EF4444'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload modal */}
      <Modal open={uploadOpen} onClose={resetUpload} title="Upload Document" size="md">
        <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
          {['File Upload', 'Add URL', 'Paste Text'].map((t, i) => (
            <button key={t} onClick={() => setUploadTab(i)} style={{
              background: uploadTab === i ? '#1A1A24' : 'none',
              border: `1px solid ${uploadTab === i ? '#2A2A38' : 'transparent'}`,
              borderRadius: 6, color: uploadTab === i ? '#F0F0F5' : '#5A5A72',
              padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
            }}>
              {t}
            </button>
          ))}
        </div>

        {uploadTab === 0 && (
          <div>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
              onClick={() => !selectedFile && fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#6C63FF' : selectedFile ? '#22C55E' : '#2A2A38'}`,
                borderRadius: 10, padding: '40px 20px', textAlign: 'center',
                cursor: selectedFile ? 'default' : 'pointer',
                background: dragOver ? 'rgba(108,99,255,0.05)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <div style={{ color: '#F0F0F5', fontWeight: 500 }}>{selectedFile.name}</div>
                  <div style={{ color: '#5A5A72', fontSize: 12, marginTop: 4 }}>{(selectedFile.size / 1024).toFixed(0)} KB</div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                    style={{ marginTop: 10, background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#EF4444', fontSize: 12, padding: '3px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <FileUp size={32} style={{ color: '#2A2A38', margin: '0 auto 10px' }} />
                  <div style={{ color: '#9090A8', fontWeight: 500 }}>Drop your file here</div>
                  <div style={{ color: '#5A5A72', fontSize: 12, marginTop: 4 }}>or <span style={{ color: '#6C63FF' }}>browse files</span></div>
                  <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 10 }}>PDF, TXT, DOCX, CSV accepted</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.txt,.docx,.csv" onChange={e => handleFile(e.target.files[0])} style={{ display: 'none' }} />
          </div>
        )}

        {uploadTab === 1 && (
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com/help-page"
            style={{ width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '10px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
        )}

        {uploadTab === 2 && (
          <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} rows={8}
            placeholder="Paste your documentation text here..."
            style={{ width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '10px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical' }} />
        )}

        <div style={{ marginTop: 16 }}>
          <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Assign to chatbot</label>
          <select value={assignChatbot} onChange={e => setAssignChatbot(e.target.value)} style={{
            width: '100%', background: '#111118', border: '1px solid #2A2A38',
            borderRadius: 6, color: '#F0F0F5', padding: '9px 12px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
          }}>
            {mockChatbots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <Button variant="ghost" onClick={resetUpload}>Cancel</Button>
          <Button loading={uploading} onClick={doUpload}>
            <FileUp size={14} /> Upload & Train
          </Button>
        </div>
      </Modal>

      {/* View doc modal */}
      <Modal open={!!viewDoc} onClose={() => setViewDoc(null)} title={viewDoc?.name} size="lg">
        {viewDoc && (
          <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              {[['Type', viewDoc.type], ['Size', viewDoc.size], ['Chatbot', viewDoc.chatbot], ['Uploaded', formatDate(viewDoc.uploaded)]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#3A3A4E', fontSize: 11, marginBottom: 2 }}>{k}</div>
                  <div style={{ color: '#9090A8', fontSize: 13 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: '#0D0D14', border: '1px solid #2A2A38', borderRadius: 8, padding: 20, color: '#5A5A72', fontSize: 13, lineHeight: 1.8, minHeight: 200 }}>
              [Document preview not available in demo mode. In production, this would show the extracted text content used for AI training.]
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteDoc} onClose={() => setDeleteDoc(null)} title="Delete Document" size="sm">
        {deleteDoc && (
          <div>
            <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 20px' }}>
              Delete <strong style={{ color: '#F0F0F5' }}>{deleteDoc.name}</strong>?
              The AI will no longer have access to this information.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setDeleteDoc(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => deleteDoc_(deleteDoc)}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
