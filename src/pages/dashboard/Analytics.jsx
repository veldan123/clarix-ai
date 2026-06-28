import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts';
import { mockAnalytics, mockChatbots } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1A1A24', border: '1px solid #2A2A38', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ color: '#5A5A72', fontSize: 11, marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: '#F0F0F5', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ color: p.color }}>●</span>
          <span style={{ color: '#9090A8' }}>{p.name}:</span>
          <strong>{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</strong>
        </div>
      ))}
    </div>
  );
};

const PRESETS = ['Today', '7 Days', '30 Days', '90 Days'];
const PRESET_DAYS = { 'Today': 1, '7 Days': 7, '30 Days': 30, '90 Days': 90 };

const HOURS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateHeatmap() {
  return DAYS_OF_WEEK.map(day => ({
    day,
    hours: HOURS.map(h => {
      const hour = parseInt(h);
      const isWeekend = day === 'Sat' || day === 'Sun';
      const isPeak = hour >= 9 && hour <= 17;
      const base = isWeekend ? 2 : isPeak ? 18 : 4;
      return Math.max(0, base + Math.floor(Math.random() * 12) - 3);
    }),
  }));
}

const HEATMAP = generateHeatmap();
const MAX_HEAT = Math.max(...HEATMAP.flatMap(d => d.hours));

const TOPICS = [
  { name: 'Password reset', count: 342 },
  { name: 'Pricing & plans', count: 289 },
  { name: 'API integration', count: 241 },
  { name: 'Billing issues', count: 198 },
  { name: 'Widget setup', count: 176 },
  { name: 'Document training', count: 154 },
  { name: 'Rate limits', count: 132 },
];
const MAX_TOPIC = Math.max(...TOPICS.map(t => t.count));

export default function Analytics() {
  const [preset, setPreset] = useState('30 Days');
  const [chatbotFilter, setChatbotFilter] = useState('all');
  const { addToast } = useToast();

  const days = PRESET_DAYS[preset] || 30;
  const data = useMemo(() => mockAnalytics.slice(-days), [days]);

  const exportCSV = () => {
    const headers = ['Date', 'Conversations', 'API Calls', 'Resolved', 'Escalated', 'Avg Response Time (ms)'];
    const rows = data.map(d => [d.date, d.conversations, d.apiCalls, d.resolved, d.escalated, d.responseTime]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `clarix-analytics-${data[0]?.date}-to-${data[data.length - 1]?.date}.csv`;
    a.click(); URL.revokeObjectURL(url);
    addToast('success', 'CSV exported', 'Analytics data downloaded successfully.');
  };

  const resolutionData = data.map(d => ({
    date: d.date.slice(5),
    'Resolved (%)': Math.round(d.resolved / (d.conversations || 1) * 100),
    'Escalated (%)': Math.round(d.escalated / (d.conversations || 1) * 100),
  }));

  const responseData = [
    { bucket: '<100ms', count: Math.floor(Math.random() * 800 + 200) },
    { bucket: '100-200ms', count: Math.floor(Math.random() * 1200 + 600) },
    { bucket: '200-400ms', count: Math.floor(Math.random() * 600 + 200) },
    { bucket: '400-800ms', count: Math.floor(Math.random() * 200 + 50) },
    { bucket: '>800ms', count: Math.floor(Math.random() * 50 + 10) },
  ];

  return (
    <div style={{ padding: 28 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#111118', border: '1px solid #2A2A38', borderRadius: 8, padding: 4, gap: 2 }}>
            {PRESETS.map(p => (
              <button key={p} onClick={() => setPreset(p)} style={{
                background: p === preset ? '#1A1A24' : 'none',
                border: `1px solid ${p === preset ? '#2A2A38' : 'transparent'}`,
                borderRadius: 6, color: p === preset ? '#F0F0F5' : '#5A5A72',
                padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.15s',
              }}>
                {p}
              </button>
            ))}
          </div>
          <select value={chatbotFilter} onChange={e => setChatbotFilter(e.target.value)} style={{
            background: '#111118', border: '1px solid #2A2A38', borderRadius: 8, color: '#9090A8',
            padding: '8px 14px', fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none',
          }}>
            <option value="all">All Chatbots</option>
            {mockChatbots.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <button onClick={exportCSV} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#111118', border: '1px solid #2A2A38', borderRadius: 8,
          color: '#9090A8', padding: '8px 16px', fontSize: 13, cursor: 'pointer',
          fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F0F0F5'; e.currentTarget.style.borderColor = '#6C63FF'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9090A8'; e.currentTarget.style.borderColor = '#2A2A38'; }}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>Conversation Volume</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
              <XAxis dataKey="date" tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false}
                tickFormatter={d => d.slice(5)} interval={Math.floor(data.length / 5)} />
              <YAxis tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="conversations" name="Conversations" stroke="#6C63FF" strokeWidth={2} dot={false} fill="url(#convGrad)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>API Call Usage</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.slice(-14)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
              <XAxis dataKey="date" tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false}
                tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={500} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Daily limit', fill: '#F59E0B', fontSize: 10 }} />
              <Bar dataKey="apiCalls" name="API Calls" fill="#6C63FF" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>Resolution Rate Over Time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={resolutionData.slice(-14)} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
              <XAxis dataKey="date" tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#5A5A72' }} />
              <Line type="monotone" dataKey="Resolved (%)" stroke="#22C55E" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Escalated (%)" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>Response Time Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={responseData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A24" />
              <XAxis dataKey="bucket" tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fill: '#3A3A4E', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Requests" fill="#A78BFA" radius={[3, 3, 0, 0]} fillOpacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>Conversation Heatmap — Conversations by Hour & Day</div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(24, 1fr)', gap: 2, minWidth: 700 }}>
            <div />
            {HOURS.slice(0, 24).map(h => (
              <div key={h} style={{ color: '#3A3A4E', fontSize: 9, textAlign: 'center', paddingBottom: 4 }}>
                {parseInt(h) % 4 === 0 ? h : ''}
              </div>
            ))}
            {HEATMAP.map(row => (
              <>
                <div key={row.day} style={{ color: '#5A5A72', fontSize: 11, display: 'flex', alignItems: 'center', paddingRight: 6 }}>
                  {row.day}
                </div>
                {row.hours.map((val, hi) => (
                  <div
                    key={hi}
                    title={`${row.day} ${HOURS[hi]}: ${val} conversations`}
                    style={{
                      height: 20, borderRadius: 2,
                      background: val === 0 ? '#0D0D14'
                        : `rgba(108,99,255,${(val / MAX_HEAT) * 0.85 + 0.08})`,
                      cursor: 'default',
                      transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.outline = '1px solid #6C63FF'}
                    onMouseLeave={e => e.currentTarget.style.outline = 'none'}
                  />
                ))}
              </>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', marginTop: 12 }}>
            <span style={{ color: '#3A3A4E', fontSize: 11 }}>Low</span>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(o => (
              <div key={o} style={{ width: 16, height: 12, borderRadius: 2, background: `rgba(108,99,255,${o})` }} />
            ))}
            <span style={{ color: '#3A3A4E', fontSize: 11 }}>High</span>
          </div>
        </div>
      </div>

      {/* Question topics */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
        <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 20 }}>Top Question Topics</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {TOPICS.map(t => (
            <div key={t.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ color: '#9090A8', fontSize: 13 }}>{t.name}</span>
                <span style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace' }}>{t.count}</span>
              </div>
              <div style={{ background: '#0D0D14', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                <div style={{ width: `${(t.count / MAX_TOPIC) * 100}%`, height: '100%', background: '#6C63FF', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
