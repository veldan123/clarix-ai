import { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, Monitor, AlertTriangle } from 'lucide-react';
import Toggle from '../../components/ui/Toggle';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { mockTeamMembers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TABS = ['General', 'Notifications', 'Team', 'Security', 'Danger Zone'];

const TIMEZONES = ['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Denver', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo'];
const INDUSTRIES = ['Technology', 'E-commerce', 'Healthcare', 'Finance', 'Education', 'Marketing', 'Legal', 'Real Estate', 'Other'];
const ROLES = ['Admin', 'Member', 'Viewer'];

function loadNotifPrefs() {
  try { return JSON.parse(localStorage.getItem('clarix_notif_prefs')) || {}; } catch { return {}; }
}

export default function Settings() {
  const [tab, setTab] = useState('General');
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [general, setGeneral] = useState({
    businessName: user?.businessName || '',
    website: 'https://acme.com',
    industry: 'Technology',
    timezone: 'America/New_York',
  });

  const [notifs, setNotifs] = useState({
    unansweredEmail: true,
    weeklySummary: true,
    billingAlerts: true,
    newTeamMember: false,
    newIpKey: true,
    ...loadNotifPrefs(),
  });

  const [team, setTeam] = useState(mockTeamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Member' });
  const [inviteLoading, setInviteLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const [twoFactor, setTwoFactor] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [sessions] = useState([
    { id: 's1', device: 'Chrome 124 / macOS', location: 'San Francisco, CA', lastActive: 'Just now', current: true },
    { id: 's2', device: 'Safari 17 / iPhone', location: 'San Francisco, CA', lastActive: '2 hours ago', current: false },
    { id: 's3', device: 'Chrome 123 / Windows', location: 'New York, NY', lastActive: '3 days ago', current: false },
  ]);

  const [deleteDataOpen, setDeleteDataOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [closeAccountOpen, setCloseAccountOpen] = useState(false);
  const [closeConfirm, setCloseConfirm] = useState('');
  const [generalSaving, setGeneralSaving] = useState(false);

  useEffect(() => {
    localStorage.setItem('clarix_notif_prefs', JSON.stringify(notifs));
  }, [notifs]);

  const saveGeneral = async (e) => {
    e.preventDefault();
    setGeneralSaving(true);
    await new Promise(r => setTimeout(r, 600));
    updateUser({ businessName: general.businessName });
    setGeneralSaving(false);
    addToast('success', 'Settings saved', 'Your changes have been applied.');
  };

  const setNotif = (key) => (val) => setNotifs(n => ({ ...n, [key]: val }));

  const sendInvite = async (e) => {
    e.preventDefault();
    if (!inviteForm.email) return;
    setInviteLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setTeam(prev => [...prev, {
      id: 'member-' + Date.now(), name: inviteForm.email.split('@')[0],
      email: inviteForm.email, role: inviteForm.role, status: 'pending', avatar: '?',
    }]);
    setInviteLoading(false);
    setInviteOpen(false);
    setInviteForm({ email: '', role: 'Member' });
    addToast('success', 'Invitation sent', `${inviteForm.email} has been invited as ${inviteForm.role}.`);
  };

  const removeMember = (id) => {
    setTeam(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Member removed', 'Team member has been removed.');
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwForm.new !== pwForm.confirm) { addToast('error', 'Mismatch', 'New passwords do not match.'); return; }
    setPwLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setPwLoading(false);
    setPwForm({ current: '', new: '', confirm: '' });
    addToast('success', 'Password changed', 'Your password has been updated.');
  };

  return (
    <div style={{ padding: 28, maxWidth: 800 }}>
      {/* Tab nav */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #1A1A24', marginBottom: 28, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', background: 'none',
            border: 'none', borderBottom: `2px solid ${tab === t ? '#6C63FF' : 'transparent'}`,
            color: tab === t ? '#F0F0F5' : '#5A5A72',
            fontSize: 14, fontWeight: tab === t ? 600 : 400, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <form onSubmit={saveGeneral} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Business name" value={general.businessName}
            onChange={e => setGeneral(g => ({ ...g, businessName: e.target.value }))} />
          <Input label="Business website" value={general.website}
            onChange={e => setGeneral(g => ({ ...g, website: e.target.value }))} placeholder="https://" />
          <div>
            <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Industry</label>
            <select value={general.industry} onChange={e => setGeneral(g => ({ ...g, industry: e.target.value }))} style={{
              width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6,
              color: '#F0F0F5', padding: '9px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
            }}>
              {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Timezone</label>
            <select value={general.timezone} onChange={e => setGeneral(g => ({ ...g, timezone: e.target.value }))} style={{
              width: '100%', background: '#111118', border: '1px solid #2A2A38', borderRadius: 6,
              color: '#F0F0F5', padding: '9px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
            }}>
              {TIMEZONES.map(tz => <option key={tz}>{tz}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <Button type="submit" loading={generalSaving}>Save Changes</Button>
          </div>
        </form>
      )}

      {tab === 'Notifications' && (
        <div>
          <p style={{ color: '#5A5A72', fontSize: 14, marginBottom: 20 }}>
            Manage how and when Clarix contacts you.
          </p>
          <Toggle label="Email when AI can't answer" description="Get notified when a customer asks something the AI couldn't handle"
            checked={notifs.unansweredEmail} onChange={setNotif('unansweredEmail')} />
          <Toggle label="Weekly usage summary" description="A summary of conversations, API usage, and top questions every Monday"
            checked={notifs.weeklySummary} onChange={setNotif('weeklySummary')} />
          <Toggle label="Billing alerts" description="Alerts when you approach plan limits or your payment fails"
            checked={notifs.billingAlerts} onChange={setNotif('billingAlerts')} />
          <Toggle label="New team member joins" description="Get notified when someone accepts your invitation"
            checked={notifs.newTeamMember} onChange={setNotif('newTeamMember')} />
          <Toggle label="API key used from new location" description="Security alert when an API key is used from an unrecognized IP"
            checked={notifs.newIpKey} onChange={setNotif('newIpKey')} />
        </div>
      )}

      {tab === 'Team' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ color: '#5A5A72', fontSize: 13 }}>{team.length} team member{team.length !== 1 ? 's' : ''}</div>
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus size={14} /> Invite Member
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {team.map(m => (
              <div key={m.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', background: '#111118',
                border: '1px solid #2A2A38', borderRadius: 8,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: m.status === 'pending' ? '#2A2A38' : '#6C63FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {m.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#F0F0F5', fontSize: 14, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ color: '#5A5A72', fontSize: 12 }}>{m.email}</div>
                </div>
                <Badge variant={m.status === 'pending' ? 'warning' : 'neutral'}>
                  {m.status === 'pending' ? 'Pending' : m.role}
                </Badge>
                <button onClick={() => removeMember(m.id)} aria-label="Remove member" style={{
                  background: 'none', border: 'none', color: '#5A5A72', cursor: 'pointer', display: 'flex',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#5A5A72'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Team Member" size="sm">
            <form onSubmit={sendInvite} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Email address" type="email" value={inviteForm.email}
                onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} placeholder="colleague@company.com" required />
              <div>
                <label style={{ color: '#9090A8', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Role</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ROLES.map(r => (
                    <button key={r} type="button" onClick={() => setInviteForm(f => ({ ...f, role: r }))} style={{
                      flex: 1, padding: '8px', background: inviteForm.role === r ? 'rgba(108,99,255,0.08)' : '#0D0D14',
                      border: `1px solid ${inviteForm.role === r ? '#6C63FF' : '#2A2A38'}`,
                      borderRadius: 6, color: inviteForm.role === r ? '#F0F0F5' : '#5A5A72',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: 13,
                    }}>
                      {r}
                    </button>
                  ))}
                </div>
                <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 6 }}>
                  {inviteForm.role === 'Admin' && 'Full access to all features'}
                  {inviteForm.role === 'Member' && 'Can manage chatbots and documents'}
                  {inviteForm.role === 'Viewer' && 'Read-only access to analytics'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button variant="ghost" type="button" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button type="submit" loading={inviteLoading}>Send Invitation</Button>
              </div>
            </form>
          </Modal>
        </div>
      )}

      {tab === 'Security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Change password */}
          <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
            <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 16 }}>Change Password</div>
            <form onSubmit={savePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Input label="Current password" type="password" value={pwForm.current}
                onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} />
              <Input label="New password" type="password" value={pwForm.new}
                onChange={e => setPwForm(f => ({ ...f, new: e.target.value }))} />
              <Input label="Confirm new password" type="password" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" size="sm" loading={pwLoading}>Update Password</Button>
              </div>
            </form>
          </div>

          {/* 2FA */}
          <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: twoFactor ? 16 : 0 }}>
              <div>
                <div style={{ color: '#F0F0F5', fontWeight: 600 }}>Two-Factor Authentication</div>
                <div style={{ color: '#5A5A72', fontSize: 13, marginTop: 2 }}>Add an extra layer of security to your account</div>
              </div>
              <button
                onClick={() => { setTwoFactor(v => !v); setShowQR(!twoFactor); }}
                style={{
                  background: twoFactor ? '#22C55E' : '#2A2A38', border: 'none',
                  borderRadius: 20, width: 44, height: 24, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: twoFactor ? 23 : 3, width: 18, height: 18,
                  borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
            {twoFactor && (
              <div style={{ borderTop: '1px solid #2A2A38', paddingTop: 16 }}>
                <p style={{ color: '#9090A8', fontSize: 13, marginBottom: 12 }}>
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div style={{
                  width: 150, height: 150, background: '#fff', borderRadius: 8, padding: 8,
                  display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 1, margin: '0 0 12px',
                }}>
                  {Array.from({ length: 225 }, (_, i) => (
                    <div key={i} style={{ background: Math.random() > 0.5 ? '#000' : '#fff', borderRadius: 1 }} />
                  ))}
                </div>
                <div style={{ color: '#22C55E', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Shield size={12} /> 2FA enabled
                </div>
              </div>
            )}
          </div>

          {/* Sessions */}
          <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24 }}>
            <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 16 }}>Active Sessions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sessions.map(s => (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: '#0D0D14', border: '1px solid #1A1A24', borderRadius: 8,
                }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Monitor size={16} style={{ color: '#5A5A72', flexShrink: 0 }} />
                    <div>
                      <div style={{ color: '#F0F0F5', fontSize: 13 }}>{s.device}</div>
                      <div style={{ color: '#3A3A4E', fontSize: 11 }}>{s.location} · {s.lastActive}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {s.current && <Badge variant="success" size="sm">Current</Badge>}
                    {!s.current && (
                      <button style={{
                        background: 'none', border: '1px solid #2A2A38', borderRadius: 4,
                        color: '#5A5A72', fontSize: 12, padding: '3px 8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      }}>
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'Danger Zone' && (
        <div style={{
          background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10, padding: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <AlertTriangle size={18} style={{ color: '#EF4444' }} />
            <span style={{ color: '#EF4444', fontWeight: 600, fontSize: 16 }}>Danger Zone</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '16px 0', borderBottom: '1px solid rgba(239,68,68,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#F0F0F5', fontWeight: 500 }}>Delete All Data</div>
                <div style={{ color: '#5A5A72', fontSize: 13 }}>Permanently delete all chatbots, documents, and conversations.</div>
              </div>
              <Button variant="danger" size="sm" onClick={() => setDeleteDataOpen(true)}>Delete All Data</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#F0F0F5', fontWeight: 500 }}>Close Account</div>
                <div style={{ color: '#5A5A72', fontSize: 13 }}>Permanently close your Clarix account. This cannot be undone.</div>
              </div>
              <Button variant="danger" size="sm" onClick={() => setCloseAccountOpen(true)}>Close Account</Button>
            </div>
          </div>
        </div>
      )}

      <Modal open={deleteDataOpen} onClose={() => { setDeleteDataOpen(false); setDeleteConfirm(''); }} title="Delete All Data" size="sm">
        <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 14px' }}>
          This will permanently delete all your chatbots, documents, API keys, and conversation history. Type <strong style={{ color: '#EF4444' }}>DELETE</strong> to confirm.
        </p>
        <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
          placeholder="Type DELETE to confirm"
          style={{ width: '100%', background: '#0D0D14', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '9px 12px', fontSize: 14, fontFamily: 'JetBrains Mono, monospace', outline: 'none', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => { setDeleteDataOpen(false); setDeleteConfirm(''); }}>Cancel</Button>
          <Button variant="danger" disabled={deleteConfirm !== 'DELETE'} onClick={() => {
            setDeleteDataOpen(false); setDeleteConfirm('');
            addToast('warning', 'All data deleted', 'Your account data has been cleared.');
          }}>Delete Everything</Button>
        </div>
      </Modal>

      <Modal open={closeAccountOpen} onClose={() => { setCloseAccountOpen(false); setCloseConfirm(''); }} title="Close Account" size="sm">
        <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 14px' }}>
          This will permanently close your account. Enter your email address to confirm.
        </p>
        <input value={closeConfirm} onChange={e => setCloseConfirm(e.target.value)}
          placeholder={user?.email}
          style={{ width: '100%', background: '#0D0D14', border: '1px solid #2A2A38', borderRadius: 6, color: '#F0F0F5', padding: '9px 12px', fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', marginBottom: 16 }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => { setCloseAccountOpen(false); setCloseConfirm(''); }}>Cancel</Button>
          <Button variant="danger" disabled={closeConfirm !== user?.email} onClick={() => {
            setCloseAccountOpen(false); setCloseConfirm('');
            addToast('error', 'Account closed', 'Your account has been permanently closed.');
          }}>Close Account</Button>
        </div>
      </Modal>
    </div>
  );
}
