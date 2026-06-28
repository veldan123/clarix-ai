import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import CodeBlock from '../../components/ui/CodeBlock';
import Badge from '../../components/ui/Badge';
import Footer from '../../components/layout/Footer';

const SECTIONS = [
  'Getting Started', 'Authentication', 'API Reference',
  'Embed Widget', 'Webhooks', 'Rate Limits', 'Error Codes',
];

const METHOD_COLORS = {
  POST: { bg: 'rgba(34,197,94,0.12)', color: '#22C55E' },
  GET: { bg: 'rgba(56,189,248,0.12)', color: '#38BDF8' },
  DELETE: { bg: 'rgba(239,68,68,0.12)', color: '#EF4444' },
};

function MethodBadge({ method }) {
  const c = METHOD_COLORS[method] || { bg: '#1A1A24', color: '#9090A8' };
  return (
    <span style={{
      ...c, padding: '2px 8px', borderRadius: 4,
      fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
    }}>
      {method}
    </span>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={{ marginBottom: 64 }}>
      <h2 style={{ color: '#F0F0F5', fontSize: 24, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.5px', borderBottom: '1px solid #1A1A24', paddingBottom: 16 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Endpoint({ method, path, description, params, response, curlCode, pythonCode }) {
  return (
    <div style={{ marginBottom: 32, background: '#111118', border: '1px solid #2A2A38', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', background: '#0D0D14', borderBottom: '1px solid #2A2A38', display: 'flex', alignItems: 'center', gap: 10 }}>
        <MethodBadge method={method} />
        <code style={{ color: '#F0F0F5', fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{path}</code>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ color: '#9090A8', fontSize: 14, margin: '0 0 16px' }}>{description}</p>
        {params && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#5A5A72', fontSize: 11, fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>PARAMETERS</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1A1A24' }}>
                  {['Name', 'Type', 'Required', 'Description'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', color: '#3A3A4E', fontSize: 11, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {params.map(p => (
                  <tr key={p.name} style={{ borderBottom: '1px solid #0D0D14' }}>
                    <td style={{ padding: '8px 10px' }}><code style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{p.name}</code></td>
                    <td style={{ padding: '8px 10px', color: '#A78BFA', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>{p.type}</td>
                    <td style={{ padding: '8px 10px' }}>{p.required ? <span style={{ color: '#EF4444', fontSize: 11 }}>required</span> : <span style={{ color: '#3A3A4E', fontSize: 11 }}>optional</span>}</td>
                    <td style={{ padding: '8px 10px', color: '#5A5A72', fontSize: 12 }}>{p.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {curlCode && (
          <CodeBlock tabs={[
            { label: 'cURL', language: 'curl', code: curlCode },
            { label: 'Python', language: 'python', code: pythonCode || '# Python SDK coming soon' },
          ]} />
        )}
        {response && (
          <div style={{ marginTop: 16 }}>
            <div style={{ color: '#5A5A72', fontSize: 11, fontWeight: 600, letterSpacing: '1px', marginBottom: 8 }}>RESPONSE</div>
            <CodeBlock code={response} language="json" title="json" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const contentRef = useRef(null);

  useEffect(() => {
    const handler = () => {
      const sections = SECTIONS.map(s => s.toLowerCase().replace(/\s+/g, '-'));
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = SECTIONS.map(s => ({ label: s, id: s.toLowerCase().replace(/\s+/g, '-') }));

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50, height: 60,
        background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1A1A24',
        display: 'flex', alignItems: 'center', padding: '0 24px', gap: 20,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 26, height: 26, background: '#6C63FF', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={13} color="#fff" fill="#fff" />
          </div>
          <span style={{ color: '#F0F0F5', fontWeight: 700, fontSize: 14 }}>Clarix AI Support</span>
        </Link>
        <ChevronRight size={14} style={{ color: '#3A3A4E' }} />
        <span style={{ color: '#5A5A72', fontSize: 14 }}>Documentation</span>
      </header>

      <div style={{ display: 'flex', flex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        {/* Left sidebar */}
        <nav style={{
          width: 220, flexShrink: 0, position: 'sticky', top: 60,
          height: 'calc(100vh - 60px)', overflowY: 'auto', padding: '28px 0',
          borderRight: '1px solid #1A1A24',
        }}>
          <div style={{ color: '#3A3A4E', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', padding: '0 16px', marginBottom: 8 }}>
            REFERENCE
          </div>
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'block', padding: '8px 16px',
                color: activeSection === item.id ? '#A78BFA' : '#5A5A72',
                background: activeSection === item.id ? 'rgba(108,99,255,0.08)' : 'transparent',
                borderLeft: `2px solid ${activeSection === item.id ? '#6C63FF' : 'transparent'}`,
                textDecoration: 'none', fontSize: 13, transition: 'all 0.15s',
                fontWeight: activeSection === item.id ? 500 : 400,
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Main content */}
        <main ref={contentRef} style={{ flex: 1, padding: '40px 48px', minWidth: 0 }}>
          <Section id="getting-started" title="Getting Started">
            <p style={{ color: '#9090A8', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
              Clarix AI Support gives you a fully managed AI support layer you can deploy in minutes. This guide walks you through account setup, document training, and making your first API call.
            </p>
            <div style={{ marginBottom: 20 }}>
              <div style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Prerequisites</div>
              <ul style={{ color: '#9090A8', fontSize: 14, lineHeight: 2, paddingLeft: 20 }}>
                <li>A Clarix AI Support account (free at clarixaisupport.com/signup)</li>
                <li>Documents to train on (PDF, TXT, DOCX, or CSV)</li>
                <li>A website or application to embed the widget into</li>
              </ul>
            </div>
            <div style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quickstart</div>
            <CodeBlock language="bash" code={`# Step 1: Create your account at clarixaisupport.com/signup

# Step 2: Upload your documentation
curl -X POST https://api.clarixaisupport.com/v1/documents/upload \\
  -H "Authorization: Bearer clx_live_your_key" \\
  -F "file=@faq.pdf" \\
  -F "chatbot_id=bot_a8f3d92k"

# Step 3: Make your first chat call
curl -X POST https://api.clarixaisupport.com/v1/chat \\
  -H "Authorization: Bearer clx_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{"chatbot_id":"bot_a8f3d92k","message":"How do I reset my password?"}'`} />
          </Section>

          <Section id="authentication" title="Authentication">
            <p style={{ color: '#9090A8', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              All API requests must include your API key in the <code style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace', background: '#111118', padding: '2px 6px', borderRadius: 4 }}>Authorization</code> header as a Bearer token.
            </p>
            <CodeBlock code={`curl https://api.clarixaisupport.com/v1/usage \\
  -H "Authorization: Bearer clx_live_a8f3d92k1mp4x7r0b2n9q5s6t8u3v1w"`} language="curl" />
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '12px 16px', marginTop: 16, color: '#9090A8', fontSize: 13 }}>
              <strong style={{ color: '#F59E0B' }}>Security:</strong> Never include API keys in client-side JavaScript or version control. Use environment variables and server-side proxying for browser applications.
            </div>
          </Section>

          <Section id="api-reference" title="API Reference">
            <p style={{ color: '#9090A8', fontSize: 14, marginBottom: 8 }}>Base URL:</p>
            <code style={{ color: '#A78BFA', fontFamily: 'JetBrains Mono, monospace', background: '#111118', border: '1px solid #2A2A38', padding: '8px 14px', borderRadius: 6, display: 'block', marginBottom: 24, fontSize: 14 }}>
              https://api.clarixaisupport.com/v1
            </code>

            <Endpoint
              method="POST" path="/v1/chat"
              description="Send a message to an AI chatbot and receive a response. This is the primary endpoint for real-time customer support."
              params={[
                { name: 'chatbot_id', type: 'string', required: true, description: 'The ID of the chatbot to query' },
                { name: 'message', type: 'string', required: true, description: 'The customer message to respond to' },
                { name: 'session_id', type: 'string', required: false, description: 'Unique session identifier to maintain conversation context' },
              ]}
              curlCode={`curl -X POST https://api.clarixaisupport.com/v1/chat \\
  -H "Authorization: Bearer clx_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "chatbot_id": "bot_a8f3d92k",
    "message": "How do I reset my password?",
    "session_id": "usr_8f3k2m"
  }'`}
              response={`{
  "id": "msg_4k2m9x7r",
  "content": "To reset your password, click the 'Forgot Password' link on the login page...",
  "chatbot_id": "bot_a8f3d92k",
  "session_id": "usr_8f3k2m",
  "escalated": false,
  "sources": ["Password Reset Guide v2.pdf"],
  "created_at": "2026-06-28T12:34:56Z"
}`}
            />

            <Endpoint
              method="POST" path="/v1/documents/upload"
              description="Upload a document to train your AI chatbot. Supported formats: PDF, TXT, DOCX, CSV."
              params={[
                { name: 'file', type: 'file', required: true, description: 'The document file to upload (multipart/form-data)' },
                { name: 'chatbot_id', type: 'string', required: true, description: 'The chatbot to assign this document to' },
                { name: 'name', type: 'string', required: false, description: 'Display name for the document' },
              ]}
              curlCode={`curl -X POST https://api.clarixaisupport.com/v1/documents/upload \\
  -H "Authorization: Bearer clx_live_..." \\
  -F "file=@faq.pdf" \\
  -F "chatbot_id=bot_a8f3d92k" \\
  -F "name=FAQ v3"`}
              response={`{
  "id": "doc_9p3m6k",
  "name": "FAQ v3",
  "status": "processing",
  "size_bytes": 245760,
  "chatbot_id": "bot_a8f3d92k",
  "created_at": "2026-06-28T12:34:56Z"
}`}
            />

            <Endpoint
              method="GET" path="/v1/documents"
              description="List all documents for your account, optionally filtered by chatbot."
              params={[
                { name: 'chatbot_id', type: 'string', required: false, description: 'Filter documents by chatbot ID' },
                { name: 'limit', type: 'integer', required: false, description: 'Number of results to return (default: 20, max: 100)' },
              ]}
              curlCode={`curl https://api.clarixaisupport.com/v1/documents?chatbot_id=bot_a8f3d92k \\
  -H "Authorization: Bearer clx_live_..."`}
              response={`{
  "data": [
    { "id": "doc_9p3m6k", "name": "FAQ v3", "status": "trained" },
    { "id": "doc_4k2m1x", "name": "Product Docs", "status": "trained" }
  ],
  "total": 2,
  "has_more": false
}`}
            />

            <Endpoint method="DELETE" path="/v1/documents/{id}" description="Permanently remove a document from a chatbot's knowledge base." curlCode={`curl -X DELETE https://api.clarixaisupport.com/v1/documents/doc_9p3m6k \\
  -H "Authorization: Bearer clx_live_..."`} response={`{ "deleted": true, "id": "doc_9p3m6k" }`} />

            <Endpoint method="GET" path="/v1/usage" description="Fetch usage statistics for the current billing period." curlCode={`curl https://api.clarixaisupport.com/v1/usage \\
  -H "Authorization: Bearer clx_live_..."`} response={`{
  "period_start": "2026-06-01",
  "period_end": "2026-06-30",
  "api_calls_used": 3847,
  "api_calls_limit": 5000,
  "conversations": 1247,
  "resolution_rate": 0.78
}`} />
          </Section>

          <Section id="embed-widget" title="Embed Widget">
            <p style={{ color: '#9090A8', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              The Clarix widget requires a single script tag. Drop it in your HTML before the closing <code style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace', background: '#111118', padding: '2px 6px', borderRadius: 4 }}>&lt;/body&gt;</code> tag.
            </p>
            <CodeBlock language="html" code={`<script
  src="https://cdn.clarixaisupport.com/widget.js"
  data-chatbot-id="bot_a8f3d92k"
  data-theme="dark"
  data-accent-color="#6C63FF"
  data-position="bottom-right"
  data-placeholder="How can we help?"
  async>
</script>`} />

            <div style={{ marginTop: 24 }}>
              <div style={{ color: '#F0F0F5', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Configuration Options</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111118', border: '1px solid #2A2A38', borderRadius: 8, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2A2A38' }}>
                    {['Option', 'Type', 'Default', 'Description'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', color: '#3A3A4E', fontSize: 11, textAlign: 'left', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['data-chatbot-id', 'string', 'required', 'Your chatbot ID from the dashboard'],
                    ['data-theme', '"light" | "dark" | "auto"', '"auto"', 'Widget color scheme'],
                    ['data-accent-color', 'hex color', '"#6C63FF"', 'Primary accent color for buttons and highlights'],
                    ['data-position', '"bottom-right" | "bottom-left"', '"bottom-right"', 'Widget position on screen'],
                    ['data-placeholder', 'string', '"Ask me anything..."', 'Input field placeholder text'],
                    ['data-greeting', 'string', '"Hi! How can I help?"', 'Initial greeting message'],
                    ['data-hide-branding', 'boolean', 'false', 'Hide "Powered by Clarix" (Growth+ plans only)'],
                  ].map(([opt, type, def, desc]) => (
                    <tr key={opt} style={{ borderBottom: '1px solid #0D0D14' }}>
                      <td style={{ padding: '10px 16px' }}><code style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{opt}</code></td>
                      <td style={{ padding: '10px 16px', color: '#A78BFA', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{type}</td>
                      <td style={{ padding: '10px 16px', color: '#5A5A72', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{def}</td>
                      <td style={{ padding: '10px 16px', color: '#5A5A72', fontSize: 13 }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p style={{ color: '#9090A8', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
              Webhooks allow you to receive real-time notifications when events occur in Clarix. Register a URL and we'll POST event payloads to it.
            </p>
            <div style={{ color: '#F0F0F5', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Available Events</div>
            {['conversation.started', 'message.sent', 'escalation.requested', 'conversation.ended'].map(evt => (
              <div key={evt} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1A1A24' }}>
                <code style={{ color: '#A78BFA', fontFamily: 'JetBrains Mono, monospace', fontSize: 13, background: 'rgba(167,139,250,0.08)', padding: '2px 8px', borderRadius: 4 }}>{evt}</code>
                <span style={{ color: '#5A5A72', fontSize: 13 }}>
                  {evt === 'conversation.started' && 'A new chat session begins'}
                  {evt === 'message.sent' && 'AI sends a response to the customer'}
                  {evt === 'escalation.requested' && 'AI routes conversation to human support'}
                  {evt === 'conversation.ended' && 'Session ends due to inactivity or closure'}
                </span>
              </div>
            ))}
          </Section>

          <Section id="rate-limits" title="Rate Limits">
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111118', border: '1px solid #2A2A38', borderRadius: 8, overflow: 'hidden', marginBottom: 20 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A38' }}>
                  {['Plan', 'Monthly Calls', 'Burst Limit', 'Concurrent'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: '#3A3A4E', fontSize: 11, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Starter', '100/day', '5 req/sec', '2'],
                  ['Growth', '5,000/mo', '10 req/sec', '10'],
                  ['Pro', '25,000/mo', '50 req/sec', '50'],
                ].map(([plan, ...vals]) => (
                  <tr key={plan} style={{ borderBottom: '1px solid #0D0D14' }}>
                    <td style={{ padding: '12px 16px', color: '#F0F0F5', fontSize: 13, fontWeight: 500 }}>{plan}</td>
                    {vals.map((v, i) => <td key={i} style={{ padding: '12px 16px', color: '#9090A8', fontSize: 13 }}>{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: '#9090A8', fontSize: 14, lineHeight: 1.8 }}>
              When you exceed the rate limit, the API returns a <code style={{ color: '#EF4444', fontFamily: 'JetBrains Mono, monospace', background: '#111118', padding: '2px 6px', borderRadius: 4 }}>429 Too Many Requests</code> response with a <code style={{ color: '#38BDF8', fontFamily: 'JetBrains Mono, monospace', background: '#111118', padding: '2px 6px', borderRadius: 4 }}>Retry-After</code> header.
            </p>
          </Section>

          <Section id="error-codes" title="Error Codes">
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#111118', border: '1px solid #2A2A38', borderRadius: 8, overflow: 'hidden' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A38' }}>
                  {['Code', 'HTTP Status', 'Meaning', 'Resolution'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', color: '#3A3A4E', fontSize: 11, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['auth_required', '401', 'Missing or invalid API key', 'Include Authorization: Bearer <key> header'],
                  ['forbidden', '403', 'Insufficient permissions for this operation', 'Check your API key scopes'],
                  ['not_found', '404', 'Resource does not exist', 'Verify the ID in your request'],
                  ['rate_limited', '429', 'Too many requests', 'Wait the number of seconds in Retry-After header'],
                  ['invalid_input', '422', 'Request validation failed', 'Check the errors array in the response body'],
                  ['document_too_large', '413', 'File exceeds 4MB limit', 'Split large documents into smaller files'],
                  ['internal_error', '500', 'Unexpected server error', 'Retry with exponential backoff; contact support if persists'],
                ].map(([code, status, meaning, resolution]) => (
                  <tr key={code} style={{ borderBottom: '1px solid #0D0D14' }}>
                    <td style={{ padding: '12px 16px' }}><code style={{ color: '#A78BFA', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{code}</code></td>
                    <td style={{ padding: '12px 16px', color: status.startsWith('2') ? '#22C55E' : status.startsWith('4') ? '#F59E0B' : '#EF4444', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{status}</td>
                    <td style={{ padding: '12px 16px', color: '#9090A8', fontSize: 13 }}>{meaning}</td>
                    <td style={{ padding: '12px 16px', color: '#5A5A72', fontSize: 12 }}>{resolution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        </main>

        {/* Right "on this page" */}
        <aside style={{
          width: 180, flexShrink: 0, position: 'sticky', top: 60,
          height: 'calc(100vh - 60px)', overflowY: 'auto', padding: '28px 0 28px 20px',
          borderLeft: '1px solid #1A1A24',
        }}>
          <div style={{ color: '#3A3A4E', fontSize: 10, fontWeight: 700, letterSpacing: '1.5px', marginBottom: 10 }}>ON THIS PAGE</div>
          {navItems.map(item => (
            <a key={item.id} href={`#${item.id}`}
              onClick={e => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                display: 'block', padding: '5px 0',
                color: activeSection === item.id ? '#A78BFA' : '#3A3A4E',
                textDecoration: 'none', fontSize: 12, transition: 'color 0.15s',
                borderLeft: `2px solid ${activeSection === item.id ? '#6C63FF' : 'transparent'}`,
                paddingLeft: 10,
              }}
            >
              {item.label}
            </a>
          ))}
        </aside>
      </div>
      <Footer />
    </div>
  );
}
