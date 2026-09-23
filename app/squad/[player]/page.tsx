import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, Globe2, Shield, Trophy } from 'lucide-react';
import { squad } from '../data';

export function generateStaticParams() { return squad.map(member => ({ player: member.slug })); }
export default async function PlayerProfile({ params }: { params: Promise<{ player: string }> }) {
  const { player } = await params;
  const member = squad.find(item => item.slug === player) ?? squad[0];
  return <main className="section-page player-profile"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/squad" className="back-link"><ArrowLeft size={15}/> Back to squad</Link></header><section className="profile-hero"><div className="profile-photo"><img src={member.image} alt={member.name}/><div className="profile-photo-number">{member.number ?? 'DU'}</div><div className="profile-photo-badge">DU<span>UNITED</span></div><div className="profile-photo-season">DURBAN UNITED<br/><b>FIRST TEAM · 26/27</b></div><div className="profile-photo-caption"><span>{member.role}</span><strong>{member.name}</strong><small>{member.nationality} · {member.category}</small></div></div><div className="profile-copy"><div className="eyebrow">{member.category} · DURBAN UNITED</div><h1>{member.name}</h1><p>{member.bio}</p><Link href="/shop" className="primary profile-link">SHOP THE KIT <ArrowUpRight size={14}/></Link></div></section><section className="profile-stats"><div><Shield size={18}/><span>POSITION</span><strong>{member.role}</strong></div><div><Globe2 size={18}/><span>NATIONALITY</span><strong>{member.nationality}</strong></div><div><CalendarDays size={18}/><span>SEASON</span><strong>2026 / 27</strong></div><div><Trophy size={18}/><span>APPEARANCES</span><strong>{member.appearances}</strong></div></section><div className="profile-next"><Link href="/squad"><ArrowLeft size={15}/> View all squad profiles</Link></div></main>;
}
