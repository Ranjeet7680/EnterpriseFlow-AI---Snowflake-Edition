/**
 * app/welcome/page.js
 *
 * This page acts as a visual guide when you visit localhost:3000/welcome.
 * In a real environment, proxy.js intercepts this request and returns
 * the raw Edge Config JSON greeting.
 */
export default function WelcomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#060b13',
      color: '#e2e8f0',
      fontFamily: "'Inter', sans-serif",
      gap: '20px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Orbs */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        top: '-50px',
        left: '-50px',
        borderRadius: '9999px',
        background: 'radial-gradient(circle, rgba(0, 229, 195, 0.12) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }} />

      {/* SVG Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        background: 'linear-gradient(135deg, rgba(0,229,195,0.1), rgba(173,198,255,0.1))',
        border: '1px solid rgba(0, 229, 195, 0.25)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,8.5 22,17.5 12,22 2,17.5 2,8.5" stroke="#00E5C3" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="3" fill="#00E5C3"/>
        </svg>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #00E5C3, #adc6ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.5px'
        }}>
          /welcome Route
        </h1>
        <p style={{
          fontSize: '9px',
          color: '#94a3b8',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: '6px'
        }}>
          Vercel Edge Config Handler
        </p>
      </div>

      {/* Card Content */}
      <div style={{
        background: '#0a111e',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '28px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          lineHeight: 1.6,
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          To see the Edge Config value, run <code style={{ color: '#00E5C3', background: 'rgba(0,229,195,0.08)', padding: '2px 6px', borderRadius: '4px' }}>vercel env pull .env.local</code> locally to load <code style={{ color: '#adc6ff' }}>EDGE_CONFIG</code>.
        </p>

        <div style={{
          background: 'rgba(255,107,107,0.06)',
          border: '1px solid rgba(255,107,107,0.15)',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span className="material-symbols-outlined" style={{ color: '#ff6b6b', fontSize: '20px' }}>info</span>
          <span style={{ fontSize: '11px', color: '#ff6b6b', fontFamily: 'JetBrains Mono' }}>
            Fallback Active: EDGE_CONFIG env not pulled yet.
          </span>
        </div>
      </div>

      <a href="/" style={{
        fontSize: '13px',
        color: '#00E5C3',
        fontWeight: 600,
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '10px'
      }}>
        Back to Dashboard
      </a>
    </main>
  );
}
