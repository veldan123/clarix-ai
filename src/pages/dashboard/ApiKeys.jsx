import { useState } from 'react';
import { Plus, Eye, EyeOff, Copy, Check, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { mockApiKeys } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

function KeyDisplay({ keyStr, fullKey }) {
  const [revealed, setRevealed] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(null);

  const reveal = () => {
    setRevealed(true);
    setCountdown(10);
    clearInterval(timer);
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(id); setRevealed(false); return 10; }
        return c - 1;
      });
    }, 1000);
    setTimer(id);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(fullKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <code style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
        color: '#9090A8', background: '#0D0D14',
        border: '1px solid #1A1A24', borderRadius: 4, padding: '4px 8px',
      }}>
        {revealed ? fullKey : keyStr + '...'}
        {revealed && <span style={{ color: '#F59E0B', marginLeft: 8, fontSize: 11 }}>({countdown}s)</span>}
      </code>
      <button onClick={revealed ? () => { setRevealed(false); clearInterval(timer); } : reveal}
        aria-label={revealed ? 'Hide key' : 'Reveal key'}
        style={{ background: 'none', border: 'none', color: '#5A5A72', cursor: 'pointer', display: 'flex', padding: 2 }}
        onMouseEnter={e => e.currentTarget.style.color = '#F0F0F5'}
        onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
      >
        {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
      <button onClick={copy} aria-label="Copy key"
        style={{ background: 'none', border: 'none', color: copied ? '#22C55E' : '#5A5A72', cursor: 'pointer', display: 'flex', padding: 2 }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const SCOPES = [
  { id: 'chat', label: 'Chat', desc: 'Send and receive chat messages' },
  { id: 'documents', label: 'Documents', desc: 'Upload and manage documents' },
  { id: 'analytics', label: 'Analytics', desc: 'Access usage statistics' },
  { id: 'webhooks', label: 'Webhooks', desc: 'Register and manage webhooks' },
];

export default function ApiKeys() {
  const [keys, setKeys] = useState(mockApiKeys);
  const [genOpen, setGenOpen] = useState(false);
  const [newKeyResult, setNewKeyResult] = useState(null);
  const [revokeKey, setRevokeKey] = useState(null);
  const [regenKey, setRegenKey] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [resultCopied, setResultCopied] = useState(false);
  const [form, setForm] = useState({ name: '', environment: 'live', scopes: ['chat', 'documents'] });
  const { addToast } = useToast();

  const toggleScope = (scope) => {
    setForm(f => ({
      ...f,
      scopes: f.scopes.includes(scope) ? f.scopes.filter(s => s !== scope) : [...f.scopes, scope],
    }));
  };

  const generateKey = async () => {
    if (!form.name) { addToast('error', 'Name required', 'Please enter a name for this key.'); return; }
    setGenerating(true);
    await new Promise(r => setTimeout(r, 800));
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const rand = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const prefix = `clx_${form.environment === 'live' ? 'live' : 'test'}_`;
    const fullKey = prefix + rand(16) + rand(16);
    const maskedKey = prefix + rand(8) + '...' + rand(4);

    const newKey = {
      id: 'key-' + Date.now(),
      name: form.name,
      key: maskedKey,
      fullKey,
      environment: form.environment,
      scopes: form.scopes,
      created: new Date().toISOString(),
      lastUsed: null,
      requestsThisMonth: 0,
      status: 'active',
    };
    setKeys(prev => [newKey, ...prev]);
    setGenerating(false);
    setGenOpen(false);
    setNewKeyResult({ key: fullKey, name: form.name });
    setForm({ name: '', environment: 'live', scopes: ['chat', 'documents'] });
  };

  const revokeKey_ = (k) => {
    setKeys(prev => prev.filter(key => key.id !== k.id));
    setRevokeKey(null);
    addToast('warning', 'Key revoked', `${k.name} has been deactivated.`);
  };

  const regenKey_ = async (k) => {
    setRegenKey(null);
    await new Promise(r => setTimeout(r, 500));
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const rand = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const prefix = `clx_${k.environment === 'live' ? 'live' : 'test'}_`;
    const fullKey = prefix + rand(16) + rand(16);
    setKeys(prev => prev.map(key => key.id === k.id ? { ...key, fullKey, key: prefix + rand(8) + '...' + rand(4) } : key));
    setNewKeyResult({ key: fullKey, name: k.name });
    addToast('success', 'Key regenerated', `${k.name} has a new key value.`);
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(newKeyResult.key);
      setResultCopied(true);
      setTimeout(() => setResultCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ color: '#F0F0F5', fontSize: 16, fontWeight: 600 }}>API Keys</div>
          <div style={{ color: '#5A5A72', fontSize: 13 }}>{keys.length} key{keys.length !== 1 ? 's' : ''} configured</div>
        </div>
        <Button onClick={() => setGenOpen(true)}><Plus size={15} /> Generate New Key</Button>
      </div>

      <div style={{
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 8, padding: '10px 16px', marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 10, color: '#F59E0B', fontSize: 13,
      }}>
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
        Treat your API keys like passwords. Never expose them in client-side code or commit them to version control.
      </div>

      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A38' }}>
              {['Name', 'Key', 'Environment', 'Created', 'Last Used', 'Requests', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', color: '#3A3A4E', fontSize: 11, fontWeight: 600, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map(k => (
              <tr key={k.id} style={{ borderBottom: '1px solid #0D0D14' }}>
                <td style={{ padding: '14px 16px', color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{k.name}</td>
                <td style={{ padding: '14px 16px' }}>
                  <KeyDisplay keyStr={k.key} fullKey={k.fullKey} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Badge variant={k.environment === 'live' ? 'success' : 'warning'}>
                    {k.environment === 'live' ? 'Live' : 'Test'}
                  </Badge>
                </td>
                <td style={{ padding: '14px 16px', color: '#5A5A72', fontSize: 12 }}>{formatDate(k.created)}</td>
                <td style={{ padding: '14px 16px', color: '#5A5A72', fontSize: 12 }}>
                  {k.lastUsed ? formatDate(k.lastUsed) : <span style={{ color: '#3A3A4E' }}>Never</span>}
                </td>
                <td style={{ padding: '14px 16px', color: '#9090A8', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
                  {k.requestsThisMonth.toLocaleString()}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setRegenKey(k)} aria-label="Regenerate key" title="Regenerate"
                      style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#F59E0B'; e.currentTarget.style.borderColor = '#F59E0B'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
                    >
                      <RefreshCw size={12} />
                    </button>
                    <button onClick={() => setRevokeKey(k)} aria-label="Revoke key" title="Revoke"
                      style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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

      {/* Generate modal */}
      <Modal open={genOpen} onClose={() => setGenOpen(false)} title="Generate New API Key" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Key name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Production, Staging, Dev" required hint="A descriptive name to identify this key" />
          <div>
            <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Environment</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {['live', 'test'].map(env => (
                <button key={env} onClick={() => setForm(f => ({ ...f, environment: env }))} style={{
                  flex: 1, padding: '10px', background: form.environment === env ? 'rgba(108,99,255,0.08)' : '#0D0D14',
                  border: `1px solid ${form.environment === env ? '#6C63FF' : '#2A2A38'}`,
                  borderRadius: 6, color: form.environment === env ? '#F0F0F5' : '#5A5A72',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500,
                }}>
                  {env.charAt(0).toUpperCase() + env.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Permissions</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SCOPES.map(s => (
                <label key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', background: '#0D0D14', border: '1px solid #1A1A24',
                  borderRadius: 6, cursor: 'pointer',
                }}>
                  <input type="checkbox" checked={form.scopes.includes(s.id)} onChange={() => toggleScope(s.id)}
                    style={{ accentColor: '#6C63FF' }} />
                  <div>
                    <div style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ color: '#5A5A72', fontSize: 12 }}>{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="ghost" onClick={() => setGenOpen(false)}>Cancel</Button>
            <Button loading={generating} onClick={generateKey}>Generate Key</Button>
          </div>
        </div>
      </Modal>

      {/* New key reveal modal */}
      <Modal open={!!newKeyResult} onClose={() => setNewKeyResult(null)} title="API Key Created" size="md">
        {newKeyResult && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#F59E0B', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} />
              This is the only time you will see this key. Copy it now — it cannot be recovered.
            </div>
            <div style={{ background: '#0D0D14', border: '1px solid #2A2A38', borderRadius: 8, padding: '16px 20px', marginBottom: 16 }}>
              <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#F0F0F5', wordBreak: 'break-all' }}>
                {newKeyResult.key}
              </code>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <Button onClick={copyResult} variant={resultCopied ? 'secondary' : 'primary'}>
                {resultCopied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Key</>}
              </Button>
              <Button variant="ghost" onClick={() => setNewKeyResult(null)}>I've copied my key</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Revoke confirm */}
      <Modal open={!!revokeKey} onClose={() => setRevokeKey(null)} title="Revoke API Key" size="sm">
        {revokeKey && (
          <div>
            <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 20px' }}>
              Revoke <strong style={{ color: '#F0F0F5' }}>{revokeKey.name}</strong>? Any integrations using this key will immediately stop working.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setRevokeKey(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => revokeKey_(revokeKey)}>Revoke Key</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Regen confirm */}
      <Modal open={!!regenKey} onClose={() => setRegenKey(null)} title="Regenerate Key" size="sm">
        {regenKey && (
          <div>
            <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 20px' }}>
              Regenerate <strong style={{ color: '#F0F0F5' }}>{regenKey.name}</strong>? The old key will stop working immediately. You'll need to update all integrations with the new key.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setRegenKey(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => regenKey_(regenKey)}>Regenerate</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
