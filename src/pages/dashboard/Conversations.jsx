import { useState } from 'react';
import { Search, Download, Flag, CheckCircle } from 'lucide-react';
import Badge from '../../components/ui/Badge';
import { mockConversations } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const STATUS_MAP = {
  resolved: { label: 'Resolved', variant: 'success' },
  escalated: { label: 'Escalated', variant: 'error' },
  in_progress: { label: 'In Progress', variant: 'info' },
};

function relTime(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Conversations() {
  const [convs, setConvs] = useState(mockConversations);
  const [selected, setSelected] = useState(mockConversations[0]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('All');
  const { addToast } = useToast();

  const STATUS_TABS = ['All', 'Resolved', 'Escalated', 'In Progress'];

  const filtered = convs
    .filter(c => tab === 'All' || c.status === tab.toLowerCase().replace(' ', '_'))
    .filter(c =>
      c.customerId.includes(search.toLowerCase()) ||
      c.firstMessage.toLowerCase().includes(search.toLowerCase()) ||
      c.chatbot.toLowerCase().includes(search.toLowerCase())
    );

  const markResolved = (id) => {
    setConvs(prev => prev.map(c => c.id === id ? { ...c, status: 'resolved' } : c));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status: 'resolved' }));
    addToast('success', 'Conversation resolved', 'Moved to resolved tab.');
  };

  const exportConv = (conv) => {
    const lines = [
      `Conversation Export — Clarix AI Support`,
      `Customer: ${conv.customerId}`,
      `Chatbot: ${conv.chatbot}`,
      `Status: ${conv.status}`,
      `Started: ${new Date(conv.startTime).toLocaleString()}`,
      `Duration: ${conv.duration}`,
      `Messages: ${conv.messages}`,
      `Device: ${conv.device}`,
      `Location: ${conv.location}`,
      '',
      '--- Messages ---',
      ...conv.thread.map(m => `[${formatTime(m.time)}] ${m.role === 'user' ? 'Customer' : 'AI'}: ${m.content}`),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `conversation-${conv.id}.txt`; a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Exported', 'Conversation saved to file.');
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{
        width: 340, borderRight: '1px solid #1A1A24',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'hidden',
      }}>
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5A5A72' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              style={{ width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '8px 12px 8px 32px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {STATUS_TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '6px 4px',
                background: tab === t ? 'rgba(108,99,255,0.1)' : 'none',
                border: 'none', borderBottom: `2px solid ${tab === t ? '#6C63FF' : 'transparent'}`,
                color: tab === t ? '#A78BFA' : '#5A5A72', fontSize: 11, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', fontWeight: tab === t ? 600 : 400,
                transition: 'all 0.15s',
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#5A5A72', fontSize: 13 }}>No conversations found</div>
          ) : (
            filtered.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv)}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left',
                  background: selected?.id === conv.id ? 'rgba(108,99,255,0.08)' : 'none',
                  border: 'none', borderBottom: '1px solid #0D0D14',
                  borderLeft: `3px solid ${selected?.id === conv.id ? '#6C63FF' : 'transparent'}`,
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (selected?.id !== conv.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { if (selected?.id !== conv.id) e.currentTarget.style.background = 'none'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                  <span style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>
                    {conv.customerId}
                  </span>
                  <span style={{ color: '#3A3A4E', fontSize: 11 }}>{relTime(conv.startTime)}</span>
                </div>
                <div style={{ color: '#5A5A72', fontSize: 12, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.firstMessage}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <Badge variant={STATUS_MAP[conv.status]?.variant} size="sm">
                    {STATUS_MAP[conv.status]?.label}
                  </Badge>
                  <span style={{ color: '#3A3A4E', fontSize: 11 }}>{conv.chatbot}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid #1A1A24',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <code style={{ color: '#F0F0F5', fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 600 }}>
                  {selected.customerId}
                </code>
                <Badge variant={STATUS_MAP[selected.status]?.variant}>
                  {STATUS_MAP[selected.status]?.label}
                </Badge>
              </div>
              <div style={{ color: '#5A5A72', fontSize: 12, display: 'flex', gap: 16 }}>
                <span>{selected.chatbot}</span>
                <span>{selected.messages} messages</span>
                <span>{selected.duration}</span>
                <span>{new Date(selected.startTime).toLocaleString()}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selected.status !== 'resolved' && (
                <button onClick={() => markResolved(selected.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                  borderRadius: 6, color: '#22C55E', fontSize: 12, padding: '6px 12px',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  <CheckCircle size={13} /> Mark Resolved
                </button>
              )}
              <button onClick={() => exportConv(selected)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#111118', border: '1px solid #2A2A38',
                borderRadius: 6, color: '#9090A8', fontSize: 12, padding: '6px 12px',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}>
                <Download size={13} /> Export
              </button>
            </div>
          </div>

          {/* Thread */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {selected.thread.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{ maxWidth: '70%' }}>
                  <div style={{
                    background: msg.role === 'user' ? '#6C63FF' : '#111118',
                    border: msg.role === 'assistant' ? '1px solid #2A2A38' : 'none',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '10px 14px', fontSize: 13, color: '#F0F0F5', lineHeight: 1.6,
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.role === 'user' ? 'Customer' : 'Clarix AI'} · {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Metadata */}
          <div style={{
            borderTop: '1px solid #1A1A24', padding: '14px 24px',
            display: 'flex', gap: 32, flexWrap: 'wrap',
          }}>
            {[
              ['Device', selected.device],
              ['Location', selected.location],
              ['Session length', selected.duration],
              ['Messages', selected.messages],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: '#3A3A4E', fontSize: 11, marginBottom: 2 }}>{k}</div>
                <div style={{ color: '#5A5A72', fontSize: 12 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A5A72', fontSize: 14 }}>
          Select a conversation to view
        </div>
      )}
    </div>
  );
}
