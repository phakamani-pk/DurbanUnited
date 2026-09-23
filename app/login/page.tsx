'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { apiRequest } from '../lib/api';

type Mode = 'login' | 'register';
type User = { firstName: string; email: string };

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(''); setBusy(true);
    try {
      const body = mode === 'register' ? { email, password, firstName, lastName } : { email, password };
      const result = await apiRequest<User>(`/api/v1/auth/${mode}`, { method: 'POST', body: JSON.stringify(body) });
      setMessage(`Welcome${mode === 'register' ? ' to United' : ' back'}, ${result.data.firstName}. You are signed in.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in failed.'); }
    finally { setBusy(false); }
  };
  const changeMode = () => { setMode(current => current === 'login' ? 'register' : 'login'); setMessage(''); };
  return <main className="login-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="login-layout"><div className="login-copy"><div className="eyebrow">THE FAN PORTAL</div><h1>Welcome<br/><em>home.</em></h1><p>One account for priority tickets, order history, saved stories and everything United.</p><div className="login-note"><ShieldCheck size={17}/><span>Secure club access<br/><small>Your password is protected and the session uses a secure cookie.</small></span></div></div><form className="login-form" onSubmit={submit}><h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>{mode === 'register' && <><label>First name<input value={firstName} onChange={event => setFirstName(event.target.value)} required maxLength={80}/></label><label>Last name<input value={lastName} onChange={event => setLastName(event.target.value)} required maxLength={80}/></label></>}<label>Email address<input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" required maxLength={254}/></label><label>Password<input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" required minLength={8} maxLength={128}/></label><button className="primary" type="submit" disabled={busy}>{busy ? 'PLEASE WAIT…' : mode === 'login' ? 'CONTINUE' : 'JOIN UNITED'} <ArrowUpRight size={14}/></button>{message && <p className="login-feedback" role="status">{message}</p>}<div className="register-prompt">{mode === 'login' ? 'New to United?' : 'Already a member?'} <button type="button" onClick={changeMode}>{mode === 'login' ? 'Create an account' : 'Sign in'} <Check size={13}/></button></div></form></section></main>;
}
