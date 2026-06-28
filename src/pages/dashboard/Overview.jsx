import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Zap, CheckCircle, Bot, TrendingUp, TrendingDown,
  Plus, FileText, Key, UserPlus, Check
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { mockAnalytics, mockRecentActivity, mockUnansweredQuestions } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

function StatCard({ label, value, format, change, changeLabel, color, children }) {
  const num = useCountUp(typeof value === 'number' ? value : 0);
  const display = format === 'percent' ? `${num}%` : format === 'count' ? num.toLocaleString() : num;
  const positive = parseFloat(change) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 20,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      <div style={{ color: '#5A5A72', fontSize: 12, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ color: '#F0F0F5', fontSize: 28, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
          {display}
        </div>
        {change !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: positive ? '#22C55E' : '#EF4444', fontSize: 12 }}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {change}
          </div>
        )}
      </div>
      {changeLabel && <div style={{ color: '#3A3A4E', fontSize: 11 }}>{changeLabel}</div>}
      {children}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1A1A24', border: '1px solid #2A2A38', borderRadius: 8, padding: '10px 14px',
    }}>
      <div style={{ color: '#5A5A72', fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: '#F0F0F5', fontSize: 13, display: 'flex', gap: 8 }}>
          <span style={{ color: p.color }}>●</span>
          <span>{p.name}:</span>
          <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const RANGE_DAYS = { '7d': 7, '30d': 30, '90d': 90 };
const ACT_ICONS = { MessageSquare, FileText, Key, CreditCard: Zap, Bot };

export default function Overview() {
  const [range, setRange] = useState('30d');
  const [unanswered, setUnanswered] = useState(mockUnansweredQuestions);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const data = mockAnalytics.slice(-RANGE_DAYS[range]);

  const totalConvs = data.reduce((s, d) => s + d.conversations, 0);
  const totalCalls = data.reduce((s, d) => s + d.apiCalls, 0);
  const avgResolution = Math.round(data.reduce((s, d) => s + (d.resolved / (d.conversations || 1)), 0) / data.length * 100);

  const resolve = (id) => {
    setUnanswered(prev => prev.map(q => q.id === id ? { ...q, resolved: true } : q));
    addToast('success', 'Added to documents', 'Question marked as resolved.');
  };

  const relTime = (iso) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div style={{ padding: 28, maxWidth: 1300 }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Conversations" value={totalConvs} format="count" change="+18%" changeLabel="vs previous period" />
        <StatCard label="API Calls Used" value={totalCalls} format="count" change="+24%" changeLabel="of 150,000 monthly limit">
          <div style={{ background: '#1A1A24', borderRadius: 4, height: 4, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min((totalCalls / 150000) * 100, 100)}%`, height: '100%', background: '#6C63FF', borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
        </StatCard>
        <StatCard label="Resolution Rate" value={avgResolution} format="percent" change="+3%" changeLabel="avg over selected period" />
        <StatCard label="Active Chatbots" value={2} format="count" changeLabel="of 5 chatbots total" />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, marginBottom: 28 }}>
        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ color: '#F0F0F5', fontWeight: 600 }}>Conversation Volume</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {['7d', '30d', '90d'].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  background: r === range ? '#1A1A24' : 'none',
                  border: `1px solid ${r === range ? '#2A2A38' : 'transparent'}`,
                  borderRadius: 4, color: r === range ? '#F0F0F5' : '#5A5A72',
                  padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
              <XAxis dataKey="date" tick={{ fill: '#3A3A4E', fontSize: 11 }} tickLine={false}
                tickFormatter={d => d.slice(5)} interval={Math.floor(data.length / 6)} />
              <YAxis tick={{ fill: '#3A3A4E', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="conversations" name="Conversations" stroke="#6C63FF" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 16 }}>Recent Activity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto', maxHeight: 260 }}>
            {mockRecentActivity.map((act, i) => {
              const Icon = ACT_ICONS[act.icon] || MessageSquare;
              return (
                <div key={act.id} style={{
                  display: 'flex', gap: 10, padding: '10px 0',
                  borderBottom: i < mockRecentActivity.length - 1 ? '1px solid #1A1A24' : 'none',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: 'rgba(108,99,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={13} style={{ color: '#6C63FF' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: '#9090A8', fontSize: 12, lineHeight: 1.4 }}>{act.text}</div>
                    <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 2 }}>{relTime(act.time)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #2A2A38' }}>
            <div style={{ color: '#F0F0F5', fontWeight: 600 }}>Top Unanswered Questions</div>
          </div>
          {unanswered.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#5A5A72', fontSize: 14 }}>
              No unanswered questions. Great work!
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1A1A24' }}>
                  <th style={{ padding: '10px 20px', color: '#3A3A4E', fontSize: 11, fontWeight: 600, textAlign: 'left' }}>QUESTION</th>
                  <th style={{ padding: '10px 20px', color: '#3A3A4E', fontSize: 11, fontWeight: 600, textAlign: 'center', width: 80 }}>FREQ</th>
                  <th style={{ padding: '10px 20px', width: 140 }}></th>
                </tr>
              </thead>
              <tbody>
                {unanswered.map(q => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #0D0D14' }}>
                    <td style={{ padding: '12px 20px', color: q.resolved ? '#5A5A72' : '#9090A8', fontSize: 13,
                      textDecoration: q.resolved ? 'line-through' : 'none' }}>
                      {q.question}
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center', color: '#5A5A72', fontSize: 13 }}>{q.frequency}</td>
                    <td style={{ padding: '12px 20px' }}>
                      {q.resolved ? (
                        <span style={{ color: '#22C55E', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Check size={12} /> Resolved
                        </span>
                      ) : (
                        <button onClick={() => resolve(q.id)} style={{
                          background: 'none', border: '1px solid #2A2A38',
                          borderRadius: 4, color: '#6C63FF', fontSize: 12,
                          padding: '4px 10px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                          transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(108,99,255,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          Add to Docs
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 20 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Create Chatbot', icon: Bot, path: '/dashboard/chatbots' },
              { label: 'Upload Document', icon: FileText, path: '/dashboard/documents' },
              { label: 'Get API Key', icon: Key, path: '/dashboard/api-keys' },
              { label: 'View Analytics', icon: Zap, path: '/dashboard/analytics' },
            ].map(({ label, icon: Icon, path }) => (
              <button key={label} onClick={() => navigate(path)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', background: '#0D0D14',
                border: '1px solid #1A1A24', borderRadius: 8,
                color: '#9090A8', fontSize: 13, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif', textAlign: 'left',
                transition: 'all 0.15s',
                width: '100%',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#F0F0F5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A1A24'; e.currentTarget.style.color = '#9090A8'; }}
              >
                <Icon size={15} style={{ color: '#6C63FF', flexShrink: 0 }} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
