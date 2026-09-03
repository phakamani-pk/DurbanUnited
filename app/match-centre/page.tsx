'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronDown, MapPin, Trophy } from 'lucide-react';

type Tab = 'FIXTURES' | 'RESULTS' | 'TABLE';
const fixtures = [
  ['06 SEP 2026', '15:00', 'DURBAN UNITED', 'ORLANDO PIRATES', 'Moses Mabhida Stadium', 'HOME'],
  ['20 SEP 2026', '17:30', 'AMAZULU', 'DURBAN UNITED', 'King Zwelithini Stadium', 'AWAY'],
  ['27 SEP 2026', '15:00', 'DURBAN UNITED', 'STELLENBOSCH FC', 'Moses Mabhida Stadium', 'HOME']
];
const results = [
  ['30 AUG 2026', 'DURBAN UNITED', '2 — 1', 'SUPERSPORT UNITED', '3 POINTS'],
  ['23 AUG 2026', 'KAIZER CHIEFS', '0 — 0', 'DURBAN UNITED', 'CLEAN SHEET'],
  ['16 AUG 2026', 'DURBAN UNITED', '3 — 0', 'CAPE TOWN CITY', '3 POINTS']
];
const table = [
  ['1', 'Mamelodi Sundowns', '4', '12', '10'],
  ['2', 'Durban United', '4', '10', '08'],
  ['3', 'Orlando Pirates', '4', '08', '05'],
  ['4', 'Kaizer Chiefs', '4', '07', '03'],
  ['5', 'Stellenbosch FC', '4', '06', '01'],
  ['6', 'AmaZulu', '4', '04', '-02']
];
export default function MatchCentrePage() {
  const [tab, setTab] = useState<Tab>('FIXTURES');
  return <main className="match-centre-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="match-centre-hero"><div className="eyebrow">DURBAN UNITED · 2026 / 27</div><h1>Match<br/><em>centre.</em></h1><p>Fixtures, results and the live Betway Premiership table in one place.</p></section><section className="match-centre-content"><div className="match-tabs" role="tablist">{(['FIXTURES', 'RESULTS', 'TABLE'] as Tab[]).map(item => <button role="tab" aria-selected={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item === 'TABLE' ? 'PSL TABLE' : item}</button>)}</div><div className="match-centre-toolbar"><span><Trophy size={16}/> BETWAY PREMIERSHIP</span><button>2026 / 27 <ChevronDown size={14}/></button></div>{tab === 'FIXTURES' && <div className="fixture-list">{fixtures.map(match => <article className="fixture-row" key={match[0] + match[2]}><div className="fixture-date"><strong>{match[0]}</strong><span>{match[1]}</span></div><div className="fixture-teams"><strong>{match[2]}</strong><span>VS</span><strong>{match[3]}</strong></div><div className="fixture-venue"><MapPin size={14}/>{match[4]}</div><span className={`home-away ${match[5].toLowerCase()}`}>{match[5]}</span><button className="fixture-action">MATCH DETAILS</button></article>)}</div>}{tab === 'RESULTS' && <div className="result-list">{results.map(match => <article className="result-row" key={match[0]}><span className="result-date">{match[0]}</span><strong>{match[1]}</strong><b>{match[2]}</b><strong>{match[3]}</strong><span className="result-note">{match[4]}</span></article>)}</div>}{tab === 'TABLE' && <div className="table-panel"><div className="table-intro"><div><span className="admin-kicker">LEAGUE STANDINGS</span><h2>Betway Premiership</h2></div><span>Updated after Round 04</span></div><div className="league-table"><div className="league-head"><span>#</span><span>CLUB</span><span>P</span><span>PTS</span><span>GD</span></div>{table.map((row, index) => <div className={`league-row ${row[1] === 'Durban United' ? 'highlight' : ''}`} key={row[1]}><span>{row[0]}</span><strong>{row[1]}</strong><span>{row[2]}</span><b>{row[3]}</b><span>{row[4]}</span></div>)}</div><div className="table-key"><span><i className="champions"/> Champions League places</span><span><i className="relegation"/> Relegation zone</span></div></div>}</section></main>;
}
