'use client';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Photo from '@/components/Photo';
import TransitionLink from '@/components/TransitionLink';
import { useNavMaterial } from '@/components/useNavMaterial';
import { useScrollParallax } from '@/components/useScrollParallax';
import { TEAM } from '@/lib/team';
import '@/components/sheet/sheet.css';
import './team.css';

const initials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function TeamClient() {
  useNavMaterial();
  useScrollParallax();
  const kampala = TEAM.filter((m) => m.base === 'Kampala').length;
  const juba = TEAM.length - kampala;

  return (
    <SmoothScroll>
      <Nav />
      <main>
        {/* ── title sheet ── */}
        <section className="tm-hero mat mat-paper" data-mat="paper">
          <p className="eyebrow">T-000 · The team · Kampala — Juba</p>
          <h1 className="tm-h1">One studio,<br /><em>{TEAM.length} people.</em></h1>
          <p className="lede">
            Architects, designers and builders under one roof, so the person who draws a wall
            is answerable for the wall. <strong>{kampala} in Kampala, {juba} in Juba.</strong>
          </p>
          <table className="pj-block tm-block">
            <tbody>
              <tr><th>Studio</th><td>Design-Build</td><th>Est.</th><td>Kampala</td></tr>
              <tr><th>People</th><td>{String(TEAM.length).padStart(2, '0')}</td><th>Offices</th><td>02</td></tr>
            </tbody>
          </table>
        </section>

        {/* ── the people ── */}
        <section className="tm-grid mat mat-white" data-mat="white">
          {TEAM.map((m, i) => (
            <article key={i} className="tm-card">
              <div className="plate tm-plate" data-py={i % 2 ? 0.05 : -0.05}>
                {m.photo
                  ? <Photo src={m.photo} alt={m.name} sizes="(max-width: 899px) 100vw, 33vw" />
                  : <span className="tm-initials" aria-hidden>{initials(m.name)}</span>}
              </div>
              <p className="tm-idx">T-{String(i + 1).padStart(2, '0')} · {m.base}</p>
              <h2 className="tm-name">{m.name}</h2>
              <p className="tm-role">{m.role}</p>
              <p className="tm-bio">{m.bio}</p>
            </article>
          ))}
        </section>

        {/* ── join ── */}
        <section className="tm-join mat mat-black" data-mat="black">
          <p className="eyebrow">Join the studio</p>
          <h2 className="tm-h2">The next <em>desk</em> is open.</h2>
          <p className="lede">
            We hire architects, interior designers and site engineers who want to see
            their drawings built. Send a portfolio and a line about what you want to make.
          </p>
          <div className="tm-links">
            <a href="mailto:sulternative@gmail.com" className="ct-btn">Send a portfolio ↗</a>
            <TransitionLink href="/contact">Contact the studio</TransitionLink>
          </div>
        </section>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
