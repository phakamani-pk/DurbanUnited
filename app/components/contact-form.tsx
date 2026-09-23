'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { apiRequest } from '../lib/api';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(''); setBusy(true);
    try {
      const result = await apiRequest<{ email: string }>('/api/v1/contact/subscriptions', { method: 'POST', body: JSON.stringify({ email }) });
      setMessage(`You're on the updates list at ${result.data.email}.`); setEmail('');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save your email.'); }
    finally { setBusy(false); }
  };
  return <form className="contact-strip" onSubmit={submit}>
    <Mail size={18}/><label htmlFor="contact-email">Contact updates</label>
    <input id="contact-email" type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" required maxLength={254}/>
    <button className="primary" type="submit" disabled={busy}>{busy ? 'SAVING…' : 'JOIN UPDATES'} <ArrowUpRight size={14}/></button>
    {message && <p role="status">{message}</p>}
  </form>;
}
