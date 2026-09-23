'use client';

import { FormEvent, useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setMessage('Contact delivery is not active in this preview. No details were submitted or stored.');
  };

  return <form className="contact-strip" onSubmit={submit}>
    <Mail size={18}/>
    <label htmlFor="contact-email">Contact updates</label>
    <input id="contact-email" type="email" placeholder="Your email address" required/>
    <button className="primary" type="submit">CHECK AVAILABILITY <ArrowUpRight size={14}/></button>
    {message && <p role="status">{message}</p>}
  </form>;
}
