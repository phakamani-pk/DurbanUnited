'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ChevronRight } from 'lucide-react';
import { squad, SquadCategory } from './data';

const categories: Array<'ALL' | SquadCategory> = ['ALL', 'GOALKEEPERS', 'DEFENDERS', 'MIDFIELDERS', 'FORWARDS', 'TECHNICAL'];
export default function SquadPage() {
  const [category, setCategory] = useState<'ALL' | SquadCategory>('ALL');
  const visibleMembers = category === 'ALL' ? squad : squad.filter(member => member.category === category);
  return <main className="section-page squad-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="section-page-hero squad-hero"><div className="eyebrow">THE FIRST TEAM · 26/27</div><h1>Meet the<br/><em>United.</em></h1><p>Every player, every role, one badge. Explore the squad by position and open a full profile for each member.</p></section><section className="squad-content"><div className="category-tabs" role="tablist" aria-label="Squad categories">{categories.map(item => <button key={item} role="tab" aria-selected={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="squad-heading"><div><span className="admin-kicker">{category === 'ALL' ? 'FIRST TEAM' : category}</span><h2>{visibleMembers.length} members</h2></div><span className="squad-count">{category === 'ALL' ? 'FULL SQUAD' : 'FILTERED VIEW'}</span></div><div className="squad-grid">{visibleMembers.map(member => <Link href={`/squad/${member.slug}`} className="squad-member" key={member.slug}><div className="member-image"><img src={member.image} alt={member.name}/><span>{member.number ?? 'DU'}</span></div><div className="member-info"><div><small>{member.role} · {member.nationality}</small><h3>{member.name}</h3></div><ArrowUpRight size={17}/></div></Link>)}</div></section><div className="squad-footer"><span>Player profiles</span><ChevronRight size={15}/><span>Stats, story and squad details</span></div></main>;
}
