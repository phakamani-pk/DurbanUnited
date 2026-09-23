'use client';

import { useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronDown, CircleUserRound, FileText, LayoutDashboard, Menu, Package, Search, Settings, ShoppingBag, Ticket, Trophy, Users, X } from 'lucide-react';
import Link from 'next/link';

const areas = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Users', icon: Users },
  { label: 'Players', icon: Trophy },
  { label: 'News Articles', icon: FileText },
  { label: 'Match Management', icon: CalendarDays }
];
const rows = [
  ['#DU-1084', 'Thabo Mokoena', 'Home Jersey 26/27', 'R899', 'Paid'],
  ['#DU-1083', 'Lerato Mthembu', 'Matchday Scarf', 'R249', 'Processing'],
  ['#DU-1082', 'Sipho Dlamini', 'Training Tee', 'R449', 'Paid'],
  ['#DU-1081', 'Ayesha Naidoo', 'Home Jersey 26/27', 'R899', 'Shipped']
];

export default function AdminPage() {
  const [active, setActive] = useState('Overview');
  const [menu, setMenu] = useState(false);

  return <main className="admin-app">
    <aside className={`admin-sidebar ${menu ? 'open' : ''}`}><div className="admin-brand"><span className="crest">DU</span><strong>UNITED<br /><small>CONTROL ROOM</small></strong><button className="admin-close" aria-label="Close admin navigation" onClick={() => setMenu(false)}><X size={17}/></button></div><div className="admin-nav">{areas.map(({ label, icon: Icon }) => <button className={active === label ? 'selected' : ''} key={label} onClick={() => { setActive(label); setMenu(false); }}><Icon size={17}/><span>{label}</span></button>)}</div><button className="admin-settings"><Settings size={16}/> Settings</button></aside>
    <section className="admin-main"><div className="preview-banner">STATIC UI PREVIEW · SAMPLE DATA · NO ADMIN ACTIONS ARE LIVE</div><header className="admin-header"><button className="admin-menu" aria-label={menu ? 'Close admin navigation' : 'Open admin navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={20}/></button><div><span className="admin-kicker">DURBAN UNITED / {active.toUpperCase()}</span><h1>{active}</h1></div><div className="admin-user"><span><strong>Admin User</strong><small>Super administrator</small></span><CircleUserRound size={30}/><ChevronDown size={14}/></div></header>
      {active === 'Overview' ? <><div className="admin-actions"><Link href="/" className="back-link"><ArrowLeft size={15}/> View public site</Link><button className="admin-export">Export report</button></div><div className="stat-grid"><div><span>Gross merchandise value</span><strong>R48,290</strong><small className="up">↑ 18.4% this month</small></div><div><span>Active members</span><strong>2,481</strong><small className="up">↑ 9.2% this month</small></div><div><span>Upcoming fixtures</span><strong>01</strong><small>Next: 27 Sep 2026</small></div><div><span>Content published</span><strong>12</strong><small>Last 30 days</small></div></div><div className="admin-columns"><section className="data-panel"><div className="panel-head"><div><span className="admin-kicker">COMMERCE</span><h2>Recent orders</h2></div><button>View all <ArrowLeft size={13} style={{transform:'rotate(180deg)'}}/></button></div><div className="table-wrap" tabIndex={0} role="region" aria-label="Recent orders table, scroll horizontally for more columns"><table><thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th></tr></thead><tbody>{rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td className={index === 4 ? `status ${cell.toLowerCase()}` : ''} key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section><section className="data-panel activity"><div className="panel-head"><div><span className="admin-kicker">LIVE FEED</span><h2>Club activity</h2></div><span className="live-dot">LIVE</span></div><p><b>New player profile</b><br/>Siyanda Ndlovu was added to the squad.</p><p><b>Fixture updated</b><br/>Kick-off time confirmed for 15:00.</p><p><b>Article published</b><br/>“A new chapter begins under the lights”.</p></section></div></> : <section className="empty-panel"><div className="empty-icon"><Search size={22}/></div><span className="admin-kicker">{active.toUpperCase()}</span><h2>Manage {active.toLowerCase()}</h2><p>This workspace is ready for secure CMS data and role-based workflows.</p><button className="admin-export">Create new {active === 'Match Management' ? 'fixture' : active.slice(0, -1).toLowerCase()}</button></section>}
    </section>
  </main>;
}
