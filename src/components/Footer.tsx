export default function Footer() {
  return (
    <footer
      style={{
        padding: '28px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(var(--fg-rgb),0.1)',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontFamily: 'var(--font-syne)',
            fontWeight: 800,
            fontSize: 14,
            color: 'var(--ember)',
          }}
        >
          U.S
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Shaping Spaces Across East Africa
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          © 2026 Ulternative Spaces. All rights reserved.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            color: 'var(--steel)',
            letterSpacing: '0.08em',
            margin: 0,
          }}
        >
          Built by{' '}
          <a
            href="https://pearl-umber.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit"
            style={{
              color: 'var(--parch)',
              textDecoration: 'none',
              borderBottom: '1px solid currentColor',
              transition: 'color 0.2s ease',
            }}
          >
            Pearl Web Studio
          </a>
        </p>
      </div>
      <style>{`
        .footer-credit:hover { color: var(--ember) !important; }
      `}</style>
    </footer>
  );
}
