'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, LogOut, PackageCheck, ShieldCheck, UserRound } from 'lucide-react';
import { apiRequest } from '../lib/api';

type User = { id: string; firstName: string; lastName: string; email: string; role: 'fan' | 'editor' | 'admin' };
type Order = { id: string; status: string; totalCents: number; createdAt: string; itemCount: number };
type Notification = { id: string; title: string; body: string; createdAt: string; readAt: string | null };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'signed-out' | 'error'>('loading');
  useEffect(() => {
    apiRequest<User>('/api/v1/auth/me').then(async result => {
      if (result.data.role === 'admin') { window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/admin/`); return; }
      setUser(result.data);
      const [orderResult, notificationResult] = await Promise.all([apiRequest<Order[]>('/api/v1/me/orders'), apiRequest<Notification[]>('/api/v1/me/notifications')]);
      setOrders(orderResult.data); setNotifications(notificationResult.data); setState('ready');
    }).catch(error => setState(error instanceof Error && error.message === 'Sign in is required.' ? 'signed-out' : 'error'));
  }, []);
  const logout = async () => { await apiRequest('/api/v1/auth/logout', { method: 'POST' }); window.location.assign(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/`); };
  if (state === 'loading') return <main className="profile-page"><p className="portal-state">Loading your United profile…</p></main>;
  if (state === 'signed-out') return <main className="profile-page"><section className="portal-state"><ShieldCheck/><h1>Sign in to your profile</h1><p>Your orders and club communications are private.</p><Link className="primary" href="/login">SIGN IN</Link></section></main>;
  if (state === 'error' || !user) return <main className="profile-page"><section className="portal-state"><h1>Profile unavailable</h1><p>The club service could not load your account. Please try again shortly.</p><Link href="/">Back to the website</Link></section></main>;
  return <main className="profile-page"><header className="profile-header"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br/>UNITED</span></Link><div><Link href="/shop">Browse shop</Link><button onClick={logout}><LogOut size={15}/> Sign out</button></div></header><section className="profile-hero"><div><span className="eyebrow">SUPPORTER PROFILE</span><h1>Welcome, {user.firstName}.</h1><p>{user.email}</p></div><UserRound size={56}/></section><section className="profile-grid"><article className="profile-panel"><div className="profile-panel-head"><div><PackageCheck/><span>ORDER TRACKING</span></div><strong>{orders.length}</strong></div>{orders.length ? <div className="profile-list">{orders.map(order => <div key={order.id}><span>#{order.id.slice(0, 8)}</span><b>{order.status}</b><small>{order.itemCount} item{order.itemCount === 1 ? '' : 's'} · {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(order.totalCents / 100)}</small></div>)}</div> : <div className="profile-empty"><p>No orders yet.</p><Link href="/shop">Visit the United store</Link></div>}</article><article className="profile-panel"><div className="profile-panel-head"><div><Bell/><span>CLUB COMMUNICATIONS</span></div><strong>{notifications.filter(item => !item.readAt).length}</strong></div>{notifications.length ? <div className="profile-list">{notifications.map(item => <div key={item.id}><b>{item.title}</b><p>{item.body}</p><small>{new Date(item.createdAt).toLocaleDateString('en-ZA')}</small></div>)}</div> : <div className="profile-empty"><p>No new messages.</p><span>Club updates will appear here.</span></div>}</article></section></main>;
}
