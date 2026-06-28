import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Shield, Clock, Upload, Cpu, Globe, FileText, Code, Layout,
  BarChart2, Users, ChevronDown, Check, X, Star, ArrowRight, Send, Loader2, Copy
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import CodeBlock from '../../components/ui/CodeBlock';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are the Clarix AI Support customer support assistant. Clarix AI Support is a B2B SaaS platform that allows businesses to embed AI-powered customer support chatbots into their websites via a simple script tag or REST API.

Key facts about Clarix AI Support:
- Starter plan: Free, 100 API calls/day, 1 chatbot
- Growth plan: $49/month, 5,000 API calls/month, 5 chatbots, custom branding
- Pro plan: $149/month, 25,000 API calls/month, unlimited chatbots, SLA, webhooks
- Setup takes under 10 minutes
- Supports PDF, TXT, DOCX, CSV document training
- Widget is embedded with one script tag
- API uses Bearer token authentication
- Base URL: https://api.clarixaisupport.com/v1
- Supports 10+ languages automatically
- When AI cannot answer, it escalates to human support

Answer questions helpfully, concisely, and professionally. Keep responses under 150 words. If asked something outside Clarix AI Support's scope, politely redirect.`;

function useCountUp(target, duration = 1500, start = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function HeroChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm the Clarix AI assistant. How can I help you today?" },
  ]);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const sampleConvo = [
      { role: 'user', content: "How quickly can I get set up?" },
      { role: 'assistant', content: "Most businesses are live in under 10 minutes. Just upload your docs, grab the script tag, and paste it into your site. That's it!" },
      { role: 'user', content: "What file types do you support?" },
      { role: 'assistant', content: "We support PDF, TXT, DOCX, and CSV files. You can also paste URLs to scrape webpage content directly." },
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < sampleConvo.length) {
        const msg = sampleConvo[i];
        setMessages(prev => [...prev, msg]);
        i++;
      } else {
        clearInterval(timer);
      }
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
      style={{
        width: 360,
        background: '#111118',
        border: '1px solid #2A2A38',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(108,99,255,0.1)',
        maxWidth: '100%',
      }}
    >
      <div style={{
        background: '#1A1A24',
        padding: '12px 16px',
        borderBottom: '1px solid #2A2A38',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
        <span style={{ color: '#F0F0F5', fontSize: 13, fontWeight: 600 }}>Clarix AI Support</span>
        <span style={{ color: '#5A5A72', fontSize: 11, marginLeft: 'auto' }}>Online</span>
      </div>
      <div style={{ height: 260, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? '#6C63FF' : '#1A1A24',
              border: msg.role === 'assistant' ? '1px solid #2A2A38' : 'none',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              padding: '8px 12px',
              fontSize: 13,
              color: '#F0F0F5',
              lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>
      <div style={{
        padding: '10px 12px',
        borderTop: '1px solid #2A2A38',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <input
          placeholder="Type a message..."
          readOnly
          style={{
            flex: 1, background: '#0A0A0F', border: '1px solid #2A2A38',
            borderRadius: 6, color: '#5A5A72', padding: '7px 10px',
            fontSize: 13, fontFamily: 'Inter, sans-serif',
          }}
        />
        <button style={{
          background: '#6C63FF', border: 'none', borderRadius: 6,
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <Send size={14} color="#fff" />
        </button>
      </div>
    </motion.div>
  );
}

function DemoChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const SUGGESTIONS = [
    "How do I embed the widget?",
    "What's included in the Growth plan?",
    "How does document training work?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput('');
    setError(null);
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      if (!ANTHROPIC_API_KEY) throw new Error('no_key');
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: newMessages,
        }),
      });
      if (!res.ok) throw new Error('api_error');
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch (err) {
      if (err.message === 'no_key') {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I'm a demo assistant for Clarix AI Support. To enable live AI responses, add your Anthropic API key to the environment variables. I can tell you that Clarix supports PDF, TXT, DOCX, and CSV training documents, and the Growth plan at $49/month includes 5,000 API calls and custom branding.",
        }]);
      } else {
        setError('Failed to get a response. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      background: '#111118',
      border: '1px solid #2A2A38',
      borderRadius: 12,
      overflow: 'hidden',
      maxWidth: 600,
      margin: '0 auto',
      boxShadow: '0 0 40px rgba(108,99,255,0.08)',
    }}>
      <div style={{
        background: '#1A1A24',
        padding: '14px 20px',
        borderBottom: '1px solid #2A2A38',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
        <span style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 14 }}>Clarix AI — Demo Agent</span>
        <span style={{ color: '#5A5A72', fontSize: 12, marginLeft: 'auto' }}>Trained on Clarix Docs</span>
      </div>

      <div style={{ height: 340, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>
              <Zap size={36} style={{ color: '#6C63FF', margin: '0 auto' }} />
            </div>
            <div style={{ color: '#F0F0F5', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>Ask anything about Clarix AI Support</div>
            <div style={{ color: '#5A5A72', fontSize: 13 }}>This demo is trained on our product documentation.</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div>
              <div style={{
                maxWidth: 400,
                background: msg.role === 'user' ? '#6C63FF' : '#1A1A24',
                border: msg.role === 'assistant' ? '1px solid #2A2A38' : 'none',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: 14,
                color: '#F0F0F5',
                lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
              <div style={{ color: '#3A3A4E', fontSize: 11, marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {timeStr}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{
              background: '#1A1A24', border: '1px solid #2A2A38',
              borderRadius: '16px 16px 16px 4px', padding: '10px 16px',
              display: 'flex', gap: 4, alignItems: 'center',
            }}>
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: '#6C63FF', display: 'block' }}
                />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div style={{ color: '#EF4444', fontSize: 13, textAlign: 'center', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8 }}>
            {error}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 0 && (
        <div style={{ padding: '0 20px 12px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.25)',
                borderRadius: 20, color: '#A78BFA', fontSize: 12, padding: '6px 12px',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.08)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #2A2A38',
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Ask about pricing, setup, integrations..."
          style={{
            flex: 1, background: '#0A0A0F', border: '1px solid #2A2A38',
            borderRadius: 8, color: '#F0F0F5', padding: '10px 14px',
            fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          aria-label="Send message"
          style={{
            background: '#6C63FF', border: 'none', borderRadius: 8,
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: loading ? 'wait' : 'pointer', flexShrink: 0,
            opacity: (!input.trim() || loading) ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? <Loader2 size={16} color="#fff" style={{ animation: 'spin 0.6s linear infinite' }} /> : <Send size={16} color="#fff" />}
        </button>
      </div>
    </div>
  );
}

function PricingCard({ plan, name, monthlyPrice, annualPrice, isAnnual, features, popular, cta, highlight }) {
  const navigate = useNavigate();
  const price = isAnnual ? annualPrice : monthlyPrice;

  return (
    <div style={{
      background: highlight ? 'rgba(108,99,255,0.06)' : '#111118',
      border: `1px solid ${highlight ? '#6C63FF' : '#2A2A38'}`,
      borderRadius: 10,
      padding: 28,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      transition: 'all 0.2s',
      boxShadow: highlight ? '0 0 32px rgba(108,99,255,0.12)' : 'none',
    }}>
      {popular && (
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          background: '#6C63FF', color: '#fff', fontSize: 11, fontWeight: 700,
          padding: '3px 14px', borderRadius: 20, letterSpacing: '0.5px',
        }}>
          MOST POPULAR
        </div>
      )}
      <div>
        <div style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>
          {name.toUpperCase()}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ color: '#F0F0F5', fontSize: 40, fontWeight: 800 }}>
            ${price}
          </span>
          <span style={{ color: '#5A5A72', fontSize: 14 }}>/mo</span>
        </div>
        {isAnnual && monthlyPrice > 0 && (
          <div style={{ color: '#22C55E', fontSize: 12, marginTop: 4 }}>
            Save ${(monthlyPrice - annualPrice) * 12}/year
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/signup')}
        style={{
          background: highlight ? '#6C63FF' : 'transparent',
          border: `1px solid ${highlight ? '#6C63FF' : '#2A2A38'}`,
          borderRadius: 6, color: highlight ? '#fff' : '#9090A8',
          padding: '10px 20px', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          if (highlight) { e.currentTarget.style.background = '#7B74FF'; }
          else { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#6C63FF'; }
        }}
        onMouseLeave={e => {
          if (highlight) { e.currentTarget.style.background = '#6C63FF'; }
          else { e.currentTarget.style.borderColor = '#2A2A38'; e.currentTarget.style.color = '#9090A8'; }
        }}
      >
        {cta}
      </button>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {features.filter(f => f.value).map((f, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#9090A8' }}>
            <Check size={14} style={{ color: '#22C55E', flexShrink: 0, marginTop: 1 }} />
            <span>{f.name}: <strong style={{ color: '#F0F0F5' }}>{f.value === true ? '✓' : f.value}</strong></span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #1A1A24' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', padding: '18px 0', background: 'none', border: 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          cursor: 'pointer', gap: 16, fontFamily: 'Inter, sans-serif',
        }}
      >
        <span style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 500, textAlign: 'left' }}>{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ flexShrink: 0 }}
        >
          <ChevronDown size={18} style={{ color: '#5A5A72' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: '#9090A8', fontSize: 14, lineHeight: 1.7, paddingBottom: 18, margin: 0 }}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);
  const [codeTab, setCodeTab] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {}
  };

  const features = [
    { icon: FileText, title: 'Document Intelligence', desc: 'Train on PDFs, URLs, plain text, and structured data. Your AI learns your product inside out — and only answers from your verified knowledge base.' },
    { icon: Code, title: 'API-First Architecture', desc: 'RESTful API with webhook support. Integrate into any stack in minutes with our Python, Node.js, and React SDKs.' },
    { icon: Layout, title: 'Embeddable Widget', desc: 'One script tag. Your branded chat widget is live. No frontend work required — just paste and your customers are supported.' },
    { icon: BarChart2, title: 'Usage Analytics', desc: 'Track every conversation, resolution rate, unanswered questions, and customer satisfaction in real time with exportable reports.' },
    { icon: Globe, title: 'Multi-language Support', desc: 'Automatic language detection. Respond to customers in their native language without any additional setup or translation services.' },
    { icon: Users, title: 'Human Escalation', desc: "When the AI doesn't know, it says so and routes to your team. Zero hallucinated answers — just confident responses or honest handoffs." },
  ];

  const plans = [
    {
      plan: 'starter', name: 'Starter',
      monthlyPrice: 0, annualPrice: 0,
      cta: 'Get Started Free', highlight: false,
      features: [
        { name: 'API calls', value: '100/day' }, { name: 'Chatbots', value: '1' },
        { name: 'Documents', value: '10' }, { name: 'Analytics', value: 'Basic' },
        { name: 'Support', value: 'Community' },
      ],
    },
    {
      plan: 'growth', name: 'Growth',
      monthlyPrice: 49, annualPrice: 39,
      cta: 'Start Growth Trial', highlight: true, popular: true,
      features: [
        { name: 'API calls', value: '5,000/mo' }, { name: 'Chatbots', value: '5' },
        { name: 'Documents', value: '50' }, { name: 'Analytics', value: 'Full' },
        { name: 'Support', value: 'Email' }, { name: 'Custom branding', value: true },
      ],
    },
    {
      plan: 'pro', name: 'Pro',
      monthlyPrice: 149, annualPrice: 119,
      cta: 'Start Pro Trial', highlight: false,
      features: [
        { name: 'API calls', value: '25,000/mo' }, { name: 'Chatbots', value: 'Unlimited' },
        { name: 'Documents', value: 'Unlimited' }, { name: 'Analytics', value: 'Advanced' },
        { name: 'Support', value: 'Priority' }, { name: 'SLA guarantee', value: '99.9%' },
        { name: 'Webhooks', value: true },
      ],
    },
  ];

  const faqs = [
    { question: 'What counts as an API call?', answer: 'Each message sent to your AI chatbot — whether via the widget or direct API — counts as one API call. Retrieving documents, fetching analytics, or checking usage do not count toward your limit.' },
    { question: 'Can I change plans at any time?', answer: 'Yes. You can upgrade instantly and your new limits take effect immediately, with a pro-rated charge for the remainder of the billing period. Downgrades take effect at the start of your next billing cycle.' },
    { question: 'What happens if I exceed my monthly limit?', answer: "Your chatbot will return a friendly message letting customers know it's temporarily unavailable and to try again later. We send you an alert at 80% and 95% of your limit so you can upgrade before hitting it." },
    { question: 'Is my business data used to train your AI?', answer: 'Never. Your documents and conversations are used only to power your own chatbots. We do not use customer data to train or improve our general AI models. Our data processing agreement covers this explicitly.' },
    { question: 'Do you offer refunds?', answer: 'We offer a full refund within 14 days of your first paid charge if you are not satisfied. After that, refunds are handled on a case-by-case basis. Contact billing@clarixaisupport.com to request one.' },
    { question: 'Can I use Clarix AI Support for internal tools, not just customer-facing support?', answer: 'Absolutely. Many customers build internal knowledge bases, HR assistants, and employee onboarding tools with Clarix. The same API and widget work for any use case — internal or external.' },
  ];

  const caseStudies = [
    {
      type: 'E-commerce retailer', metric: '73%', metricLabel: 'reduction in support tickets',
      quote: 'We used to get 400 support tickets per day about order tracking and returns. After deploying Clarix, that dropped to under 110 — and our team actually has time to focus on complex issues.',
      industry: 'Retail',
    },
    {
      type: 'SaaS startup', metric: '4.8/5', metricLabel: 'average customer satisfaction',
      quote: 'Our onboarding assistant handles every "how do I..." question our new users have, instantly. We went from a 3-day onboarding email sequence to live answers in under 2 seconds.',
      industry: 'SaaS',
    },
    {
      type: 'Healthcare clinic', metric: '24/7', metricLabel: 'patient support coverage',
      quote: "Patients used to have to wait until Monday morning to ask questions about their appointments and prescriptions. Now they get answers instantly, with proper escalation when it's something clinical.",
      industry: 'Healthcare',
    },
  ];

  const codeTabs = [
    {
      label: 'HTML Embed', language: 'html',
      code: `<!-- Add to your website's <head> or before </body> -->
<script
  src="https://cdn.clarixaisupport.com/widget.js"
  data-chatbot-id="bot_a8f3d92k1mp4"
  data-theme="dark"
  data-accent-color="#6C63FF"
  data-position="bottom-right"
  async>
</script>

<!-- That's it! Your chatbot is live. -->`,
    },
    {
      label: 'Python', language: 'python',
      code: `import clarix

# Initialize with your API key
client = clarix.Client(api_key="clx_live_a8f3d92k...")

# Send a message
response = client.chat.create(
    chatbot_id="bot_a8f3d92k1mp4",
    message="How do I reset my password?",
    session_id="usr_8f3k2m"  # optional
)

print(response.content)
# → "To reset your password, click..."

# Upload a document
doc = client.documents.upload(
    chatbot_id="bot_a8f3d92k1mp4",
    file=open("faq.pdf", "rb"),
    name="FAQ v2"
)`,
    },
    {
      label: 'Node.js', language: 'javascript',
      code: `import Clarix from '@clarix/node';

const client = new Clarix({
  apiKey: process.env.CLARIX_API_KEY,
});

// Send a chat message
const response = await client.chat.create({
  chatbotId: 'bot_a8f3d92k1mp4',
  message: 'How do I integrate with Shopify?',
  sessionId: 'usr_8f3k2m',
});

console.log(response.content);
// → "To integrate with Shopify, install..."

// List all documents
const docs = await client.documents.list({
  chatbotId: 'bot_a8f3d92k1mp4',
});`,
    },
  ];

  const platforms = ['Shopify', 'WordPress', 'Webflow', 'React', 'Next.js', 'Django'];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div className="dot-grid" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.25)',
              borderRadius: 20, padding: '5px 14px', marginBottom: 28,
            }}>
              <Zap size={13} style={{ color: '#A78BFA' }} />
              <span style={{ color: '#A78BFA', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>
                AI-Powered Customer Support Infrastructure
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 800, lineHeight: 1.1,
              color: '#F0F0F5', margin: '0 0 20px',
              letterSpacing: '-2px',
            }}
          >
            Your customers deserve answers.<br />
            <span style={{ color: '#6C63FF' }}>Not wait times.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ color: '#9090A8', fontSize: 18, lineHeight: 1.7, marginBottom: 32, maxWidth: 560, margin: '0 auto 32px' }}
          >
            Clarix AI Support turns your existing documentation into a 24/7 intelligent support agent. Embed in minutes. Scale without headcount.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}
          >
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: '#6C63FF', color: '#fff', border: 'none',
                borderRadius: 6, padding: '12px 28px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#7B74FF'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#6C63FF'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Start Building Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.getElementById('try-it-now')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: '#F0F0F5',
                border: '1px solid #2A2A38', borderRadius: 6,
                padding: '12px 28px', fontSize: 15, fontWeight: 600,
                cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C63FF'; e.currentTarget.style.color = '#6C63FF'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A38'; e.currentTarget.style.color = '#F0F0F5'; }}
            >
              See Live Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}
          >
            {[
              { icon: Shield, text: 'SOC 2 Compliant' },
              { icon: Clock, text: '99.9% Uptime' },
              { icon: Zap, text: '< 200ms Response' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5A5A72', fontSize: 13 }}>
                <Icon size={14} style={{ color: '#6C63FF' }} />
                {text}
              </div>
            ))}
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <HeroChat />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="documentation" style={{ padding: '100px 24px', background: '#0A0A0F' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ color: '#3A3A4E', fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>THE PROCESS</div>
            <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-1px' }}>
              From documents to deployed in under 10 minutes
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                num: '01', icon: Upload, title: 'Upload your knowledge base',
                desc: "Drag and drop your PDFs, paste URLs, or import CSVs. Clarix processes any format and extracts every piece of information your AI needs to answer questions accurately.",
                mockup: (
                  <div style={{ background: '#0A0A0F', border: '1px solid #1A1A24', borderRadius: 8, padding: 12, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, background: 'rgba(108,99,255,0.1)', borderRadius: 4, border: '1px dashed #6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Upload size={12} style={{ color: '#6C63FF' }} />
                      </div>
                      <div>
                        <div style={{ color: '#F0F0F5', fontWeight: 500, fontSize: 11 }}>product-docs.pdf</div>
                        <div style={{ color: '#5A5A72', fontSize: 10 }}>2.4 MB • Uploading...</div>
                      </div>
                    </div>
                    <div style={{ background: '#1A1A24', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                      <div style={{ width: '67%', height: '100%', background: '#6C63FF', borderRadius: 4 }} />
                    </div>
                  </div>
                ),
              },
              {
                num: '02', icon: Cpu, title: 'We train your AI agent',
                desc: "Our system reads, indexes, and embeds your content into a vector database. Your AI learns the nuances of your product — not just keywords, but context and meaning.",
                mockup: (
                  <div style={{ background: '#0A0A0F', border: '1px solid #1A1A24', borderRadius: 8, padding: 12, fontSize: 12 }}>
                    {['Parsing document structure', 'Generating embeddings', 'Indexing knowledge base'].map((s, i) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < 2 ? 6 : 0 }}>
                        <Check size={10} style={{ color: i < 2 ? '#22C55E' : '#5A5A72' }} />
                        <span style={{ color: i < 2 ? '#9090A8' : '#5A5A72', fontSize: 11 }}>{s}</span>
                      </div>
                    ))}
                    <div style={{ color: '#22C55E', fontSize: 11, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                      Training complete
                    </div>
                  </div>
                ),
              },
              {
                num: '03', icon: Globe, title: 'Embed and go live',
                desc: "Copy a single script tag and paste it into your website. Your branded chatbot is live immediately — no rebuild, no deployment, no DevOps required.",
                mockup: (
                  <div style={{ background: '#0A0A0F', border: '1px solid #1A1A24', borderRadius: 8, padding: 12, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
                    <span style={{ color: '#5A5A72' }}>&lt;</span>
                    <span style={{ color: '#60A5FA' }}>script</span>
                    <span style={{ color: '#38BDF8' }}> src</span>
                    <span style={{ color: '#F0F0F5' }}>=</span>
                    <span style={{ color: '#86EFAC' }}>"cdn.clarix..."</span>
                    <br />
                    <span style={{ color: '#38BDF8' }}>&nbsp;&nbsp;data-chatbot-id</span>
                    <span style={{ color: '#F0F0F5' }}>=</span>
                    <span style={{ color: '#86EFAC' }}>"bot_a8f3"</span>
                    <br />
                    <span style={{ color: '#60A5FA' }}>&nbsp;&nbsp;async</span>
                    <span style={{ color: '#5A5A72' }}>&gt;&lt;/</span>
                    <span style={{ color: '#60A5FA' }}>script</span>
                    <span style={{ color: '#5A5A72' }}>&gt;</span>
                  </div>
                ),
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                style={{
                  background: '#111118', border: '1px solid #2A2A38',
                  borderRadius: 10, padding: 28,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: '#6C63FF' }}>
                    {step.num}
                  </span>
                  <step.icon size={20} style={{ color: '#5A5A72' }} />
                </div>
                <h3 style={{ color: '#F0F0F5', fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>{step.title}</h3>
                <p style={{ color: '#5A5A72', fontSize: 13, lineHeight: 1.7, margin: '0 0 16px' }}>{step.desc}</p>
                {step.mockup}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 24px', background: '#050508' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ color: '#3A3A4E', fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>CAPABILITIES</div>
            <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Everything your support team needs, automated
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{
                  background: '#111118', border: '1px solid #2A2A38',
                  borderRadius: 8, padding: 24,
                  transition: 'all 0.2s ease',
                  cursor: 'default',
                  borderLeft: '3px solid transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderLeftColor = '#6C63FF';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,99,255,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderLeftColor = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 8,
                  background: 'rgba(108,99,255,0.1)',
                  border: '1px solid rgba(108,99,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 14,
                }}>
                  <f.icon size={18} style={{ color: '#6C63FF' }} />
                </div>
                <h3 style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 600, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ color: '#5A5A72', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE DEMO */}
      <section id="try-it-now" style={{ padding: '100px 24px', background: '#0A0A0F' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ color: '#3A3A4E', fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>TRY IT NOW</div>
            <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-1px' }}>Ask it anything</h2>
            <p style={{ color: '#9090A8', fontSize: 15, margin: 0 }}>
              This demo is trained on Clarix AI Support's own documentation. Ask about pricing, setup, API limits, or anything else.
            </p>
          </div>
          <DemoChat />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#050508' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ color: '#3A3A4E', fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>PRICING</div>
            <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-1px' }}>
              Transparent pricing that scales with you
            </h2>
            <p style={{ color: '#9090A8', fontSize: 15, marginBottom: 28 }}>Start free. Pay only when you grow.</p>

            <div style={{
              display: 'inline-flex',
              background: '#111118', border: '1px solid #2A2A38',
              borderRadius: 8, padding: 4, gap: 4,
            }}>
              {['Monthly', 'Annual (20% off)'].map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => setIsAnnual(i === 1)}
                  style={{
                    background: (isAnnual ? i === 1 : i === 0) ? '#1A1A24' : 'transparent',
                    border: (isAnnual ? i === 1 : i === 0) ? '1px solid #2A2A38' : '1px solid transparent',
                    borderRadius: 6, color: (isAnnual ? i === 1 : i === 0) ? '#F0F0F5' : '#5A5A72',
                    padding: '7px 16px', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
            {plans.map(p => (
              <PricingCard key={p.plan} {...p} isAnnual={isAnnual} />
            ))}
          </div>

          {/* Feature comparison */}
          <div style={{ background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden', marginBottom: 60 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A38' }}>
                  <th style={{ padding: '14px 20px', color: '#5A5A72', fontSize: 12, fontWeight: 600, textAlign: 'left' }}>Feature</th>
                  {['Starter', 'Growth', 'Pro'].map(p => (
                    <th key={p} style={{ padding: '14px 20px', color: '#F0F0F5', fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['API calls', '100/day', '5,000/mo', '25,000/mo'],
                  ['Chatbots', '1', '5', 'Unlimited'],
                  ['Documents', '10', '50', 'Unlimited'],
                  ['Custom branding', false, true, true],
                  ['Full analytics', false, true, true],
                  ['Email support', false, true, true],
                  ['Webhooks', false, false, true],
                  ['SLA guarantee', false, false, true],
                  ['Priority support', false, false, true],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} style={{ borderBottom: i < 8 ? '1px solid #1A1A24' : 'none' }}>
                    <td style={{ padding: '12px 20px', color: '#9090A8', fontSize: 13 }}>{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} style={{ padding: '12px 20px', textAlign: 'center' }}>
                        {v === true ? <Check size={15} style={{ color: '#22C55E', display: 'inline' }} />
                          : v === false ? <X size={15} style={{ color: '#3A3A4E', display: 'inline' }} />
                            : <span style={{ color: '#F0F0F5', fontSize: 13 }}>{v}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FAQ */}
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h3 style={{ color: '#F0F0F5', fontSize: 22, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>Frequently asked questions</h3>
            {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="case-studies" style={{ padding: '100px 24px', background: '#0A0A0F' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ color: '#3A3A4E', fontSize: 11, fontWeight: 700, letterSpacing: '2px', marginBottom: 12 }}>RESULTS</div>
            <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Built for businesses that can't afford downtime
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 60 }}>
            {caseStudies.map((cs, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  background: '#111118', border: '1px solid #2A2A38',
                  borderRadius: 10, padding: 28,
                }}
              >
                <div style={{ color: '#5A5A72', fontSize: 12, fontWeight: 500, marginBottom: 14 }}>{cs.type}</div>
                <div style={{ color: '#6C63FF', fontSize: 48, fontWeight: 800, lineHeight: 1, marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                  {cs.metric}
                </div>
                <div style={{ color: '#A78BFA', fontSize: 13, fontWeight: 500, marginBottom: 20 }}>{cs.metricLabel}</div>
                <p style={{ color: '#5A5A72', fontSize: 13, lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
                  "{cs.quote}"
                </p>
                <span style={{
                  background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                  borderRadius: 4, color: '#A78BFA', fontSize: 11, fontWeight: 600,
                  padding: '3px 10px',
                }}>
                  {cs.industry}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Star ratings */}
          <div style={{ textAlign: 'center', paddingTop: 40, borderTop: '1px solid #1A1A24' }}>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
              {[1,2,3,4,5].map(i => <Star key={i} size={20} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
            </div>
            <div style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>4.9/5 from 200+ businesses</div>
            <div style={{ overflow: 'hidden', position: 'relative' }}>
              <div style={{
                display: 'flex', gap: 24,
                animation: 'ticker 30s linear infinite',
                whiteSpace: 'nowrap',
              }}>
                {[
                  { name: 'Marcus T.', role: 'CTO at Verdesk', quote: 'Cut our support costs by 60% in the first month.' },
                  { name: 'Priya R.', role: 'Head of Support, Lumio', quote: 'Our CSAT went from 3.8 to 4.7 overnight.' },
                  { name: 'James O.', role: 'Founder, Stacklite', quote: 'Best SaaS purchase I made this year, hands down.' },
                  { name: 'Sofia L.', role: 'Operations Lead, Nexura', quote: "Finally, an AI tool that doesn't hallucinate." },
                  { name: 'Marcus T.', role: 'CTO at Verdesk', quote: 'Cut our support costs by 60% in the first month.' },
                  { name: 'Priya R.', role: 'Head of Support, Lumio', quote: 'Our CSAT went from 3.8 to 4.7 overnight.' },
                  { name: 'James O.', role: 'Founder, Stacklite', quote: 'Best SaaS purchase I made this year, hands down.' },
                  { name: 'Sofia L.', role: 'Operations Lead, Nexura', quote: "Finally, an AI tool that doesn't hallucinate." },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'inline-flex', flexDirection: 'column', gap: 4,
                    background: '#111118', border: '1px solid #2A2A38',
                    borderRadius: 8, padding: '12px 20px', minWidth: 260,
                  }}>
                    <div style={{ color: '#9090A8', fontSize: 13, fontStyle: 'italic' }}>"{r.quote}"</div>
                    <div style={{ color: '#5A5A72', fontSize: 12 }}>{r.name}, {r.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section style={{ padding: '80px 24px', background: '#050508' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <h2 style={{ color: '#F0F0F5', fontSize: 32, fontWeight: 800, textAlign: 'center', margin: '0 0 12px', letterSpacing: '-1px' }}>
            Drop into any stack
          </h2>
          <p style={{ color: '#5A5A72', textAlign: 'center', marginBottom: 36 }}>Your existing tools shouldn't need to change. Clarix fits right in.</p>

          <CodeBlock
            tabs={codeTabs.map(t => ({ ...t }))}
          />

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
            {platforms.map(p => (
              <div key={p} style={{
                background: '#111118', border: '1px solid #2A2A38',
                borderRadius: 8, padding: '8px 20px',
                color: '#9090A8', fontSize: 13, fontWeight: 500,
              }}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: '80px 24px', background: '#0A0A0F', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ color: '#F0F0F5', fontSize: 36, fontWeight: 800, margin: '0 0 14px', letterSpacing: '-1px' }}>
            Ready to transform your support?
          </h2>
          <p style={{ color: '#9090A8', fontSize: 16, marginBottom: 28 }}>
            Join 200+ businesses that have already made their customers happier and their support teams more efficient.
          </p>
          <button
            onClick={() => navigate('/signup')}
            style={{
              background: '#6C63FF', color: '#fff', border: 'none',
              borderRadius: 6, padding: '14px 36px', fontSize: 16, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7B74FF'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6C63FF'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start for free — no credit card required <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
