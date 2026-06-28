import { useState, useRef, useEffect } from 'react';
import { Plus, Bot, Code, Settings, Play, X, Send, Loader2, Copy, Check, RefreshCw, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';
import { mockChatbots } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';


const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese', 'Dutch', 'Italian', 'Polish', 'Korean'];
const TONES = [
  { value: 'Professional', desc: 'Formal, precise, and business-appropriate' },
  { value: 'Friendly', desc: 'Warm, conversational, and approachable' },
  { value: 'Concise', desc: 'Direct, brief, and to the point' },
];

function relTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ChatbotForm({ initial = {}, onSave, onClose, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    language: initial.language || 'English',
    tone: initial.tone || 'Professional',
    escalationEmail: initial.escalationEmail || '',
  });

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Input label="Chatbot name" value={form.name} onChange={set('name')} placeholder="e.g. Website Support Bot" required />
      <div>
        <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Description</label>
        <textarea
          value={form.description} onChange={set('description')}
          placeholder="What does this chatbot help with?"
          rows={2}
          style={{
            width: '100%', background: '#111118', border: '1px solid #2A2A38',
            borderRadius: 6, color: '#F0F0F5', padding: '9px 12px',
            fontSize: 14, fontFamily: 'Inter, sans-serif', resize: 'vertical', outline: 'none',
          }}
        />
      </div>
      <div>
        <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Language</label>
        <select value={form.language} onChange={set('language')} style={{
          width: '100%', background: '#111118', border: '1px solid #2A2A38',
          borderRadius: 6, color: '#F0F0F5', padding: '9px 12px',
          fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
        }}>
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Tone</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TONES.map(t => (
            <label key={t.value} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', background: form.tone === t.value ? 'rgba(108,99,255,0.08)' : '#0D0D14',
              border: `1px solid ${form.tone === t.value ? '#6C63FF' : '#2A2A38'}`,
              borderRadius: 6, cursor: 'pointer',
            }}>
              <input type="radio" value={t.value} checked={form.tone === t.value}
                onChange={set('tone')} style={{ accentColor: '#6C63FF' }} />
              <div>
                <div style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{t.value}</div>
                <div style={{ color: '#5A5A72', fontSize: 12 }}>{t.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
      <Input label="Escalation email" type="email" value={form.escalationEmail} onChange={set('escalationEmail')}
        placeholder="support@yourcompany.com"
        hint="Where to route questions the AI can't answer" />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" loading={loading}>Save</Button>
      </div>
    </form>
  );
}

function TestPanel({ bot, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          system: `You are a test instance of "${bot.name}". Tone: ${bot.tone}. ${bot.description}. Answer helpfully and concisely.`,
        }),
      });
      if (!res.ok) throw new Error('api_error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: `[Error] Could not reach the AI. Please check your API configuration.` }]);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
      background: '#111118', borderLeft: '1px solid #2A2A38',
      zIndex: 500, display: 'flex', flexDirection: 'column',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid #2A2A38',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 15 }}>Test: {bot.name}</div>
          <div style={{ color: '#F59E0B', fontSize: 11, marginTop: 2 }}>Test environment</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMessages([])} aria-label="Clear" style={{ background: 'none', border: '1px solid #2A2A38', borderRadius: 6, padding: '4px 8px', color: '#5A5A72', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Clear
          </button>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#5A5A72', cursor: 'pointer', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div style={{
        background: 'rgba(245,158,11,0.06)', borderBottom: '1px solid rgba(245,158,11,0.15)',
        padding: '8px 16px', fontSize: 11, color: '#F59E0B',
      }}>
        This is a test environment. Conversations are not recorded.
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '82%', background: m.role === 'user' ? '#6C63FF' : '#1A1A24',
              border: m.role === 'assistant' ? '1px solid #2A2A38' : 'none',
              borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '8px 12px', fontSize: 13, color: '#F0F0F5', lineHeight: 1.5,
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{
              background: '#1A1A24', border: '1px solid #2A2A38',
              borderRadius: '12px 12px 12px 2px', padding: '8px 14px',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.span key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#6C63FF', display: 'block' }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid #2A2A38', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Test your chatbot..."
          style={{ flex: 1, background: '#0A0A0F', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '8px 12px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }}
        />
        <button onClick={send} disabled={loading || !input.trim()} aria-label="Send"
          style={{ background: '#6C63FF', border: 'none', borderRadius: 6, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!input.trim() || loading) ? 0.5 : 1 }}>
          <Send size={14} color="#fff" />
        </button>
      </div>
    </div>
  );
}

export default function Chatbots() {
  const [bots, setBots] = useState(mockChatbots);
  const [createOpen, setCreateOpen] = useState(false);
  const [editBot, setEditBot] = useState(null);
  const [testBot, setTestBot] = useState(null);
  const [embedBot, setEmbedBot] = useState(null);
  const [deleteBot, setDeleteBot] = useState(null);
  const [saving, setSaving] = useState(false);
  const [embedTab, setEmbedTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const toggleStatus = (id) => {
    setBots(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
  };

  const createBot = async (form) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    const newBot = {
      ...form, id: 'bot-' + Date.now(), status: 'active',
      documents: 0, conversations: 0,
      lastActive: new Date().toISOString(), createdAt: new Date().toISOString(),
    };
    setBots(prev => [newBot, ...prev]);
    setSaving(false);
    setCreateOpen(false);
    addToast('success', 'Chatbot created!', `${form.name} is ready to use.`);
  };

  const updateBot = async (form) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setBots(prev => prev.map(b => b.id === editBot.id ? { ...b, ...form } : b));
    setSaving(false);
    setEditBot(null);
    addToast('success', 'Chatbot updated', 'Changes saved successfully.');
  };

  const confirmDelete = () => {
    setBots(prev => prev.filter(b => b.id !== deleteBot.id));
    setDeleteBot(null);
    setEditBot(null);
    addToast('info', 'Chatbot deleted', 'The chatbot has been removed.');
  };

  const embedCode = (bot, tab) => {
    if (tab === 0) return `<script\n  src="https://cdn.clarixaisupport.com/widget.js"\n  data-chatbot-id="${bot.id}"\n  data-theme="dark"\n  data-position="bottom-right"\n  async>\n</script>`;
    if (tab === 1) return `import { ClarixWidget } from '@clarix/react';\n\nexport default function App() {\n  return (\n    <div>\n      {/* Your app */}\n      <ClarixWidget\n        chatbotId="${bot.id}"\n        theme="dark"\n        position="bottom-right"\n      />\n    </div>\n  );\n}`;
    return `import Clarix from '@clarix/node';\n\nconst client = new Clarix({\n  apiKey: process.env.CLARIX_API_KEY,\n});\n\nconst response = await client.chat.create({\n  chatbotId: '${bot.id}',\n  message: userMessage,\n  sessionId: userId,\n});\n\nconsole.log(response.content);`;
  };

  const copyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode(embedBot, embedTab));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div style={{ padding: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ color: '#F0F0F5', fontSize: 16, fontWeight: 600 }}>Your Chatbots</div>
          <div style={{ color: '#5A5A72', fontSize: 13 }}>{bots.length} chatbot{bots.length !== 1 ? 's' : ''} configured</div>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={15} /> Create Chatbot
        </Button>
      </div>

      {bots.length === 0 ? (
        <EmptyState icon={Bot} title="No chatbots yet" description="Create your first chatbot to start helping customers with AI-powered support." action={() => setCreateOpen(true)} actionLabel="Create Chatbot" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bots.map(bot => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: '#111118', border: '1px solid #2A2A38', borderRadius: 10,
                padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 10, background: 'rgba(108,99,255,0.1)',
                border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Bot size={20} style={{ color: '#6C63FF' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 600 }}>{bot.name}</span>
                  <button
                    onClick={() => toggleStatus(bot.id)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                  >
                    <Badge variant={bot.status === 'active' ? 'success' : 'neutral'} dot>
                      {bot.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </div>
                <div style={{ color: '#5A5A72', fontSize: 12, display: 'flex', gap: 16 }}>
                  <span>{bot.documents} doc{bot.documents !== 1 ? 's' : ''}</span>
                  <span>{bot.conversations.toLocaleString()} conversations</span>
                  <span>Last active {relTime(bot.lastActive)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <Button size="sm" variant="secondary" onClick={() => setEditBot(bot)}>
                  <Settings size={13} /> Configure
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setTestBot(bot)}>
                  <Play size={13} /> Test
                </Button>
                <Button size="sm" variant="secondary" onClick={() => { setEmbedBot(bot); setEmbedTab(0); }}>
                  <Code size={13} /> Embed Code
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create Chatbot" size="md">
        <ChatbotForm onSave={createBot} onClose={() => setCreateOpen(false)} loading={saving} />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editBot} onClose={() => setEditBot(null)} title="Configure Chatbot" size="md">
        {editBot && (
          <div>
            <ChatbotForm initial={editBot} onSave={updateBot} onClose={() => setEditBot(null)} loading={saving} />
            <div style={{ borderTop: '1px solid #2A2A38', paddingTop: 16, marginTop: 4 }}>
              <Button variant="danger" size="sm" onClick={() => setDeleteBot(editBot)}>
                <Trash2 size={13} /> Delete Chatbot
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Embed code modal */}
      <Modal open={!!embedBot} onClose={() => setEmbedBot(null)} title="Embed Code" size="lg">
        {embedBot && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['Script Tag', 'React Component', 'API Only'].map((t, i) => (
                <button key={t} onClick={() => setEmbedTab(i)} style={{
                  background: embedTab === i ? '#1A1A24' : 'none',
                  border: `1px solid ${embedTab === i ? '#2A2A38' : 'transparent'}`,
                  borderRadius: 6, color: embedTab === i ? '#F0F0F5' : '#5A5A72',
                  padding: '7px 14px', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{
              background: '#0D0D14', border: '1px solid #2A2A38',
              borderRadius: 8, overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                padding: '10px 16px', borderBottom: '1px solid #2A2A38', background: '#111118',
              }}>
                <button onClick={copyEmbed} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: '1px solid #2A2A38', borderRadius: 4,
                  color: copied ? '#22C55E' : '#5A5A72', fontSize: 12,
                  padding: '3px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{
                margin: 0, padding: '16px 20px',
                fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
                color: '#F0F0F5', lineHeight: 1.7, overflowX: 'auto',
              }}>
                {embedCode(embedBot, embedTab)}
              </pre>
            </div>
            <div style={{ marginTop: 14 }}>
              <a href="/docs" style={{ color: '#6C63FF', fontSize: 13, textDecoration: 'none' }}>View Documentation →</a>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteBot} onClose={() => setDeleteBot(null)} title="Delete Chatbot" size="sm">
        {deleteBot && (
          <div>
            <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 20px' }}>
              Are you sure you want to delete <strong style={{ color: '#F0F0F5' }}>{deleteBot.name}</strong>?
              This will remove all associated conversations and embed codes. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setDeleteBot(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete Chatbot</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Test panel */}
      <AnimatePresence>
        {testBot && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <TestPanel bot={testBot} onClose={() => setTestBot(null)} />
          </motion.div>
        )}
      </AnimatePresence>
      {testBot && <div onClick={() => setTestBot(null)} style={{ position: 'fixed', inset: 0, zIndex: 499, background: 'rgba(0,0,0,0.3)' }} />}
    </div>
  );
}
