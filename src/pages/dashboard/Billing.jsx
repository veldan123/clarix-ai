import { useState } from 'react';
import { CreditCard, Download, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { mockInvoices, PLANS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

function UsageBar({ label, used, limit, limitLabel }) {
  const pct = Math.min((used / limit) * 100, 100);
  const color = pct > 85 ? '#EF4444' : pct > 65 ? '#F59E0B' : '#6C63FF';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: '#9090A8', fontSize: 13 }}>{label}</span>
        <span style={{ color: '#F0F0F5', fontSize: 13 }}>{used.toLocaleString()} / {limitLabel}</span>
      </div>
      <div style={{ background: '#1A1A24', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ height: '100%', background: color, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

function CardInput({ label, placeholder, value, onChange, mono, maxLen }) {
  return (
    <div>
      <label style={{ color: '#9090A8', fontSize: 12, display: 'block', marginBottom: 5 }}>{label}</label>
      <input
        value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLen}
        style={{
          width: '100%', background: '#111118', border: '1px solid #2A2A38',
          borderRadius: 6, color: '#F0F0F5', padding: '8px 10px',
          fontSize: 14, fontFamily: mono ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
          outline: 'none',
        }}
      />
    </div>
  );
}

export default function Billing() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [cardLoading, setCardLoading] = useState(false);

  const currentPlan = PLANS[user?.plan] || PLANS.starter;
  const renewDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const doUpgrade = async () => {
    if (!upgrading) return;
    setUpgradeLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    updateUser({ plan: upgrading });
    setUpgradeLoading(false);
    setUpgradeOpen(false);
    setUpgrading(null);
    addToast('success', 'Plan upgraded!', `You are now on the ${PLANS[upgrading].name} plan.`);
  };

  const saveCard = async (e) => {
    e.preventDefault();
    setCardLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setCardLoading(false);
    setPaymentOpen(false);
    addToast('success', 'Card updated', 'Your payment method has been saved.');
  };

  const downloadInvoice = (inv) => {
    const text = [
      'CLARIX AI SUPPORT — INVOICE',
      '================================',
      `Invoice ID: ${inv.id}`,
      `Date: ${new Date(inv.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
      `Plan: ${inv.plan}`,
      `Amount: ${inv.amount}`,
      `Status: ${inv.status}`,
      '',
      'Thank you for using Clarix AI Support!',
      'Questions? billing@clarixaisupport.com',
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${inv.id}.txt`;
    a.click();
  };

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      {/* Current plan */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ color: '#F0F0F5', fontSize: 20, fontWeight: 700 }}>{currentPlan.name} Plan</span>
              <Badge variant="purple">{user?.plan?.toUpperCase()}</Badge>
            </div>
            <div style={{ color: '#5A5A72', fontSize: 14 }}>
              ${currentPlan.monthlyPrice}/month · Renews {renewDate}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {user?.plan !== 'pro' && (
              <Button onClick={() => setUpgradeOpen(true)}>Upgrade Plan</Button>
            )}
            {user?.plan === 'pro' && (
              <Button variant="outline">Contact Sales</Button>
            )}
          </div>
        </div>

        <UsageBar label="API Calls" used={3847} limit={currentPlan.apiCallsNumber === Infinity ? 25000 : currentPlan.apiCallsNumber} limitLabel={currentPlan.apiCalls} />
        <UsageBar label="Chatbots" used={2} limit={currentPlan.chatbots === Infinity ? 999 : currentPlan.chatbots} limitLabel={currentPlan.chatbots === Infinity ? 'Unlimited' : currentPlan.chatbots} />
        <UsageBar label="Documents" used={7} limit={currentPlan.documents === Infinity ? 999 : currentPlan.documents} limitLabel={currentPlan.documents === Infinity ? 'Unlimited' : currentPlan.documents} />

        {user?.plan !== 'starter' && (
          <button onClick={() => setCancelOpen(true)} style={{
            background: 'none', border: 'none', color: '#EF4444', fontSize: 12,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginTop: 8, padding: 0,
          }}>
            Cancel Plan
          </button>
        )}
      </div>

      {/* Payment method */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, padding: 24, marginBottom: 20 }}>
        <div style={{ color: '#F0F0F5', fontWeight: 600, marginBottom: 16 }}>Payment Method</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              background: '#1A1A24', border: '1px solid #2A2A38',
              borderRadius: 6, padding: '8px 12px',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <CreditCard size={18} style={{ color: '#38BDF8' }} />
              <span style={{ color: '#F0F0F5', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>•••• 4242</span>
            </div>
            <div>
              <div style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>Visa ending in 4242</div>
              <div style={{ color: '#5A5A72', fontSize: 12 }}>Expires 12/27</div>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setPaymentOpen(true)}>Update</Button>
        </div>
      </div>

      {/* Invoices */}
      <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2A2A38' }}>
          <div style={{ color: '#F0F0F5', fontWeight: 600 }}>Invoice History</div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A38' }}>
              {['Invoice ID', 'Date', 'Amount', 'Plan', 'Status', ''].map(h => (
                <th key={h} style={{ padding: '11px 20px', color: '#3A3A4E', fontSize: 11, fontWeight: 600, textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockInvoices.map(inv => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #0D0D14' }}>
                <td style={{ padding: '13px 20px', color: '#F0F0F5', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}>{inv.id}</td>
                <td style={{ padding: '13px 20px', color: '#9090A8', fontSize: 13 }}>
                  {new Date(inv.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </td>
                <td style={{ padding: '13px 20px', color: '#F0F0F5', fontSize: 13, fontWeight: 600 }}>{inv.amount}</td>
                <td style={{ padding: '13px 20px', color: '#9090A8', fontSize: 13 }}>{inv.plan}</td>
                <td style={{ padding: '13px 20px' }}><Badge variant="success">{inv.status}</Badge></td>
                <td style={{ padding: '13px 20px' }}>
                  <button onClick={() => downloadInvoice(inv)} style={{
                    display: 'flex', alignItems: 'center', gap: 4, background: 'none',
                    border: '1px solid #2A2A38', borderRadius: 4, color: '#5A5A72',
                    fontSize: 12, padding: '4px 8px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F0F0F5'; e.currentTarget.style.borderColor = '#6C63FF'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#5A5A72'; e.currentTarget.style.borderColor = '#2A2A38'; }}
                  >
                    <Download size={12} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade modal */}
      <Modal open={upgradeOpen} onClose={() => { setUpgradeOpen(false); setUpgrading(null); }} title="Change Plan" size="lg">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {Object.entries(PLANS).map(([key, plan]) => (
            <div key={key} onClick={() => setUpgrading(key)} style={{
              background: upgrading === key ? 'rgba(108,99,255,0.08)' : '#0D0D14',
              border: `1px solid ${user?.plan === key ? '#22C55E' : upgrading === key ? '#6C63FF' : '#2A2A38'}`,
              borderRadius: 8, padding: 20, cursor: key !== user?.plan ? 'pointer' : 'default',
              transition: 'all 0.2s', position: 'relative',
            }}>
              {user?.plan === key && (
                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: '#22C55E', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>CURRENT</div>
              )}
              <div style={{ color: '#A78BFA', fontSize: 11, fontWeight: 600, letterSpacing: '1px' }}>{plan.name.toUpperCase()}</div>
              <div style={{ color: '#F0F0F5', fontSize: 28, fontWeight: 800, margin: '8px 0' }}>${plan.monthlyPrice}<span style={{ fontSize: 13, color: '#5A5A72', fontWeight: 400 }}>/mo</span></div>
              <div style={{ color: '#5A5A72', fontSize: 12 }}>{plan.apiCalls} API calls</div>
            </div>
          ))}
        </div>
        {upgrading && upgrading !== user?.plan && (
          <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8 }}>
            <div style={{ color: '#F0F0F5', fontSize: 14, fontWeight: 500 }}>
              Switching from {currentPlan.name} → {PLANS[upgrading].name}
            </div>
            <div style={{ color: '#5A5A72', fontSize: 13, marginTop: 4 }}>
              You'll be charged ${PLANS[upgrading].monthlyPrice}/month. The change takes effect immediately.
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
          <Button variant="ghost" onClick={() => { setUpgradeOpen(false); setUpgrading(null); }}>Cancel</Button>
          <Button disabled={!upgrading || upgrading === user?.plan} loading={upgradeLoading} onClick={doUpgrade}>
            Confirm Upgrade
          </Button>
        </div>
      </Modal>

      {/* Payment modal */}
      <Modal open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Update Payment Method" size="sm">
        <form onSubmit={saveCard} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <CardInput label="Cardholder name" placeholder="Jane Smith" value={cardForm.name} onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))} />
          <CardInput label="Card number" placeholder="4242 4242 4242 4242" value={cardForm.number} mono
            onChange={e => setCardForm(f => ({ ...f, number: e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() }))}
            maxLen={19} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <CardInput label="Expiry (MM/YY)" placeholder="12/27" value={cardForm.expiry} mono
              onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); setCardForm(f => ({ ...f, expiry: v.length > 2 ? `${v.slice(0,2)}/${v.slice(2)}` : v })); }} maxLen={5} />
            <CardInput label="CVC" placeholder="123" value={cardForm.cvc} mono maxLen={3}
              onChange={e => setCardForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) }))} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <Button variant="ghost" onClick={() => setPaymentOpen(false)} type="button">Cancel</Button>
            <Button type="submit" loading={cardLoading}>Save Card</Button>
          </div>
        </form>
      </Modal>

      {/* Cancel modal */}
      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Plan" size="sm">
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 10, color: '#EF4444', fontSize: 13 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          Cancelling will downgrade you to the free Starter plan at the end of your billing cycle.
        </div>
        <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 20px' }}>
          You will lose access to: custom branding, email support, full analytics, and all chatbots beyond 1.
          Your data will be retained for 30 days.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setCancelOpen(false)}>Keep Plan</Button>
          <Button variant="danger" onClick={() => { setCancelOpen(false); addToast('warning', 'Plan cancelled', 'Your plan will downgrade at end of cycle.'); }}>
            Cancel Plan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
