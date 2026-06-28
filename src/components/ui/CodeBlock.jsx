import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function syntaxHighlight(code, lang) {
  if (!code) return '';
  let escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  if (lang === 'html') {
    escaped = escaped
      .replace(/(&lt;\/?[\w\-]+)/g, '<span style="color:#60A5FA">$1</span>')
      .replace(/([\w\-]+)=/g, '<span style="color:#38BDF8">$1</span>=')
      .replace(/"([^"]*)"/g, '"<span style="color:#86EFAC">$1</span>"')
      .replace(/(\/\/.*)/g, '<span style="color:#5A5A72;font-style:italic">$1</span>');
  } else if (lang === 'python') {
    escaped = escaped
      .replace(/\b(import|from|def|return|if|else|elif|for|in|not|True|False|None|class|async|await|with|as)\b/g, '<span style="color:#C084FC">$1</span>')
      .replace(/"([^"]*)"|(\'[^\']*\')/g, '<span style="color:#86EFAC">$&</span>')
      .replace(/(#.*)/g, '<span style="color:#5A5A72;font-style:italic">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#FDBA74">$1</span>');
  } else if (lang === 'javascript' || lang === 'js') {
    escaped = escaped
      .replace(/\b(const|let|var|function|return|if|else|for|of|in|async|await|import|from|export|default|new|class|throw|try|catch|true|false|null|undefined)\b/g, '<span style="color:#C084FC">$1</span>')
      .replace(/`([^`]*)`/g, '<span style="color:#86EFAC">`$1`</span>')
      .replace(/"([^"]*)"|(\'[^\']*\')/g, '<span style="color:#86EFAC">$&</span>')
      .replace(/(\/\/.*)/g, '<span style="color:#5A5A72;font-style:italic">$1</span>')
      .replace(/\b(\d+)\b/g, '<span style="color:#FDBA74">$1</span>');
  } else if (lang === 'bash' || lang === 'curl') {
    escaped = escaped
      .replace(/\b(curl|POST|GET|DELETE|PUT|-H|-d|-X|pip|npm|yarn)\b/g, '<span style="color:#60A5FA">$1</span>')
      .replace(/"([^"]*)"|(\'[^\']*\')/g, '<span style="color:#86EFAC">$&</span>')
      .replace(/(#.*)/g, '<span style="color:#5A5A72;font-style:italic">$1</span>');
  } else if (lang === 'json') {
    escaped = escaped
      .replace(/"([\w\-]+)":/g, '"<span style="color:#38BDF8">$1</span>":')
      .replace(/: "([^"]*)"/g, ': "<span style="color:#86EFAC">$1</span>"')
      .replace(/: (true|false|null)/g, ': <span style="color:#C084FC">$1</span>')
      .replace(/: (\d+)/g, ': <span style="color:#FDBA74">$1</span>');
  }

  return escaped;
}

export default function CodeBlock({ code, language = 'javascript', tabs, title }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const current = tabs ? tabs[activeTab] : { code, language };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const lines = (current.code || '').split('\n');

  return (
    <div style={{
      background: '#0D0D14',
      border: '1px solid #2A2A38',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderBottom: '1px solid #2A2A38',
        background: '#111118',
      }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {tabs ? tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              style={{
                background: i === activeTab ? '#1A1A24' : 'none',
                border: i === activeTab ? '1px solid #2A2A38' : '1px solid transparent',
                borderRadius: 4,
                color: i === activeTab ? '#F0F0F5' : '#5A5A72',
                fontSize: 12,
                padding: '3px 10px',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
              }}
            >
              {tab.label}
            </button>
          )) : (
            <span style={{ color: '#5A5A72', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}>
              {title || current.language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'none', border: '1px solid #2A2A38',
            borderRadius: 4, color: copied ? '#22C55E' : '#5A5A72',
            fontSize: 12, padding: '3px 10px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px 0',
        overflowX: 'auto',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        lineHeight: 1.7,
      }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <span style={{
              color: '#3A3A4E',
              fontSize: 11,
              minWidth: 40,
              textAlign: 'right',
              paddingRight: 16,
              userSelect: 'none',
              flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <span
              style={{ color: '#F0F0F5', paddingRight: 24 }}
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(line, current.language) }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}
