export default function Footer() {
  return (
    <footer
      style={{
        padding: '28px 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.1)',
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
    </footer>
  );
}
