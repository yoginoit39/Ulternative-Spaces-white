'use client';
import { useState } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

const PROJECT_TYPES = ['Residential', 'Commercial', 'Interiors', 'Design-Build', 'Mixed-Use', 'Other'];

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' });
  const [state, setState] = useState<FormState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setState('success');
        setForm({ name: '', email: '', projectType: '', message: '' });
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  };

  return (
    <SmoothScroll>
      <Nav />
      <main style={{ backgroundColor: 'var(--ink)', minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '140px 5vw 100px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'start',
          }}
          className="contact-grid"
        >
          {/* Left — info */}
          <div style={{ position: 'sticky', top: 120 }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--ember)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              Start a Project
            </p>

            <h1 style={{
              fontFamily: 'var(--font-syne)',
              fontWeight: 800,
              fontSize: 'clamp(48px, 6vw, 88px)',
              color: 'var(--parch)',
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              margin: '0 0 40px 0',
            }}>
              LET&apos;S
              <br />
              TALK.
            </h1>

            <div style={{
              width: 48,
              height: 1,
              backgroundColor: 'var(--gold)',
              marginBottom: 40,
            }} />

            <p style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 18,
              color: 'var(--steel)',
              lineHeight: 1.75,
              marginBottom: 48,
              maxWidth: 380,
            }}>
              Tell us about your project. We&apos;ll respond within 48 hours with our
              thoughts and availability.
            </p>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <ContactDetail label="Email" value="sulternative@gmail.com" href="mailto:sulternative@gmail.com" />
              <ContactDetail label="Phone" value="+256 782 843290" href="tel:+256782843290" />
              <ContactDetail label="Kampala" value="Uganda, East Africa" href={null} />
              <ContactDetail label="Juba" value="South Sudan, East Africa" href={null} />
            </div>
          </div>

          {/* Right — form */}
          <div>
            {state === 'success' ? (
              <SuccessMessage />
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <FormField
                  label="Full Name"
                  type="text"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  required
                  placeholder="Your name"
                />
                <FormField
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                  placeholder="your@email.com"
                />

                {/* Project type */}
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 32, marginBottom: 0 }}>
                  <label style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--steel)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 16,
                    paddingTop: 28,
                  }}>
                    Project Type
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {PROJECT_TYPES.map((type) => (
                      <TypeButton
                        key={type}
                        label={type}
                        active={form.projectType === type}
                        onClick={() => setForm((f) => ({ ...f, projectType: f.projectType === type ? '' : type }))}
                      />
                    ))}
                  </div>
                </div>

                <FormTextarea
                  label="Your Message"
                  value={form.message}
                  onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                  required
                  placeholder="Tell us about your project, timeline, and budget..."
                />

                {state === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'red',
                    letterSpacing: '0.1em',
                    marginBottom: 16,
                  }}>
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}

                <SubmitButton sending={state === 'sending'} />
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
        input, textarea, select {
          outline: none;
        }
        input::placeholder, textarea::placeholder {
          color: rgba(0,0,0,0.25);
        }
      `}</style>
    </SmoothScroll>
  );
}

function ContactDetail({ label, value, href }: { label: string; value: string; href: string | null }) {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--steel)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        margin: '0 0 4px 0',
      }}>{label}</p>
      {href ? (
        <a href={href} style={{
          fontFamily: 'var(--font-cormorant)',
          fontSize: 16,
          color: 'var(--parch)',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s ease',
        }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
        >{value}</a>
      ) : (
        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: 16, color: 'var(--parch)', margin: 0 }}>{value}</p>
      )}
    </div>
  );
}

function FormField({
  label, type, value, onChange, required, placeholder,
}: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <label style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--steel)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        display: 'block',
        paddingTop: 28,
        marginBottom: 8,
      }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          fontFamily: 'var(--font-syne)',
          fontWeight: 800,
          fontSize: 'clamp(20px, 2.5vw, 32px)',
          color: 'var(--parch)',
          letterSpacing: '-0.02em',
          padding: '8px 0 20px',
          caretColor: 'var(--parch)',
        }}
      />
    </div>
  );
}

function FormTextarea({
  label, value, onChange, required, placeholder,
}: {
  label: string; value: string;
  onChange: (v: string) => void; required?: boolean; placeholder?: string;
}) {
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: 32 }}>
      <label style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--steel)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        display: 'block',
        paddingTop: 28,
        marginBottom: 8,
      }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={5}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          resize: 'none',
          fontFamily: 'var(--font-cormorant)',
          fontWeight: 300,
          fontSize: 18,
          color: 'var(--parch)',
          lineHeight: 1.7,
          padding: '8px 0 20px',
          caretColor: 'var(--parch)',
        }}
      />
    </div>
  );
}

function TypeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 8,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '7px 14px',
        border: active ? '1px solid var(--parch)' : '1px solid rgba(0,0,0,0.15)',
        background: active ? 'var(--parch)' : 'transparent',
        color: active ? 'var(--ink)' : 'var(--steel)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      {label}
    </button>
  );
}

function SubmitButton({ sending }: { sending: boolean }) {
  return (
    <button
      type="submit"
      disabled={sending}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '18px 40px',
        border: '1px solid var(--parch)',
        background: sending ? 'rgba(0,0,0,0.05)' : 'var(--parch)',
        color: sending ? 'var(--steel)' : 'var(--ink)',
        cursor: sending ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s ease',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        if (!sending) {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--parch)';
        }
      }}
      onMouseLeave={(e) => {
        if (!sending) {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--parch)';
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--ink)';
        }
      }}
    >
      {sending ? 'SENDING...' : 'SEND MESSAGE ↗'}
    </button>
  );
}

function SuccessMessage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: '60px 0',
    }}>
      <div style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1.5px solid var(--parch)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        fontSize: 20,
      }}>
        ✓
      </div>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        color: 'var(--ember)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>
        Message Received
      </p>
      <h2 style={{
        fontFamily: 'var(--font-syne)',
        fontWeight: 800,
        fontSize: 'clamp(32px, 4vw, 56px)',
        color: 'var(--parch)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        margin: '0 0 24px 0',
      }}>
        WE&apos;LL BE
        <br />
        IN TOUCH.
      </h2>
      <p style={{
        fontFamily: 'var(--font-cormorant)',
        fontWeight: 300,
        fontSize: 18,
        color: 'var(--steel)',
        lineHeight: 1.7,
        maxWidth: 380,
        marginBottom: 40,
      }}>
        Thank you for reaching out. We typically respond within 48 hours.
      </p>
      <a
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--steel)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.15)',
          paddingBottom: 4,
        }}
      >
        ← Back to site
      </a>
    </div>
  );
}
