import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, MapPin, Trophy } from 'lucide-react';
import ContactForm from '../components/contact-form';

type PageData = { eyebrow: string; title: string; intro: string; items: { label: string; detail: string; image?: string }[] };
const pages: Record<string, PageData> = {
  news: { eyebrow: 'FROM THE CLUB', title: 'Latest stories', intro: 'The people, moments and decisions shaping Durban United.', items: [
    { label: 'A new chapter begins under the lights', detail: 'Club News · 06 Sep 2026', image: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80' },
    { label: 'Five things to know about the new season', detail: 'Feature · 04 Sep 2026', image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=900&q=80' },
    { label: 'United announce community football fund', detail: 'Community · 29 Aug 2026', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80' }
  ]},
  results: { eyebrow: 'THE RECORD', title: 'Results', intro: 'A match-by-match record of the United season.', items: [{ label: 'Durban United 2 — 1 SuperSport United', detail: '30 Aug 2026 · Full time · 3 points' }, { label: 'Kaizer Chiefs 0 — 0 Durban United', detail: '23 Aug 2026 · Full time · Clean sheet' }, { label: 'Durban United 3 — 0 Cape Town City', detail: '16 Aug 2026 · Full time · Home win' }] },
  gallery: { eyebrow: 'INSIDE UNITED', title: 'Gallery', intro: 'Matchday energy, training ground focus and life beyond the pitch.', items: [{ label: 'Matchday / United under the lights', detail: '12 photos · Moses Mabhida Stadium', image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80' }, { label: 'Training / The work continues', detail: '08 photos · Princess Magogo Stadium', image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=900&q=80' }] },
  'club-history': { eyebrow: 'SINCE 1976', title: 'Club history', intro: 'Rooted in Durban. Built by generations of supporters.', items: [{ label: '1976 — The beginning', detail: 'A club is formed with a simple promise: give the coast a team to call its own.' }, { label: '2004 — First silverware', detail: 'United lift their first major cup in front of a packed home crowd.' }, { label: '2026 — A new chapter', detail: 'A modern club, with the same heartbeat.' }] },
  contact: { eyebrow: 'COME SAY HELLO', title: 'Contact United', intro: 'For supporters, partners and everyone who wants to get closer to the club.', items: [{ label: 'General enquiries', detail: 'Official contact details pending club confirmation.' }, { label: 'Club offices', detail: 'Durban, South Africa · Address pending confirmation.' }, { label: 'Commercial partnerships', detail: 'Partnership contact details pending confirmation.' }] },

};
export function generateStaticParams() { return Object.keys(pages).map(section => ({ section })); }
export default function SectionPage({ params }: { params: { section: string } }) {
  const { section } = params;
  const page = pages[section] ?? pages.news;
  return <main className="section-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="section-page-hero"><div className="eyebrow">{page.eyebrow}</div><h1>{page.title}</h1><p>{page.intro}</p></section><section className={`section-page-grid ${page.items.length === 2 ? 'two' : ''}`}>{page.items.map(item => <article className="section-page-card" key={item.label}>{item.image && <img src={item.image} alt="" />}{!item.image && <div className="page-card-icon">{section === 'contact' ? <MapPin size={22}/> : <Trophy size={22}/>}</div>}<div><span>{item.detail}</span><h2>{item.label}</h2><span className="page-card-link">Preview <ArrowUpRight size={14}/></span></div></article>)}</section>{section === 'contact' && <ContactForm/>}</main>;
}
