'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';

const ADMIN_EMAIL = 'admin@durbanunited.co.za';
const ADMIN_PASSWORD = 'UnitedAdmin2026!';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) { localStorage.setItem('du-admin-session', 'active'); window.location.href = '/admin'; return; } if (email && password) { localStorage.setItem('du-fan-session', 'active'); setError('Fan account ready. Connect the authentication API to complete sign-in.'); return; } setError('Enter your email and password to continue.'); };
  return <main className="login-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="login-layout"><div className="login-copy"><div className="eyebrow">THE FAN PORTAL</div><h1>Welcome<br/><em>home.</em></h1><p>One account for priority tickets, order history, saved stories and everything United.</p><div className="login-note"><ShieldCheck size={17}/><span>Secure club access<br/><small>Admin tools are hidden from public navigation.</small></span></div></div><form className="login-form" onSubmit={submit}><h2>Sign in</h2><label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required/></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" required/></label><button className="primary" type="submit">CONTINUE <ArrowUpRight size={14}/></button><button className="google-button" type="button">Continue with Google</button>{error && <p className="login-feedback">{error}</p>}<div className="register-prompt">New to United? <button type="button" onClick={() => setError('Registration is ready for the authentication API.')}>Create an account <Check size={13}/></button></div></form></section></main>;
}
