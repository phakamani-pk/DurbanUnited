'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { apiRequest } from '../lib/api';

type Product = { id: string; name: string; priceCents: number; stock: number; imageUrl: string };
const fallbackProducts: Product[] = [
  { id: 'jersey', name: 'Home Jersey 26/27', priceCents: 89900, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80' },
  { id: 'tee', name: 'United Training Tee', priceCents: 44900, stock: 32, imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80' },
  { id: 'cap', name: 'Heritage Cap', priceCents: 29900, stock: 9, imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80' }
];
export default function ShopPage() {
  const [products, setProducts] = useState(fallbackProducts);
  const [catalogueNotice, setCatalogueNotice] = useState('');
  useEffect(() => { apiRequest<Product[]>('/api/v1/products').then(result => setProducts(result.data)).catch(() => setCatalogueNotice('Showing the latest cached catalogue while the club service reconnects.')); }, []);
  return <main className="section-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="section-page-hero"><div className="eyebrow">THE UNITED STORE</div><h1>Wear the feeling.</h1><p>Official matchday pieces, training essentials and coastal heritage. Browse live stock; sign in before checkout.</p>{catalogueNotice && <p role="status">{catalogueNotice}</p>}</section><section className="shop-page-grid">{products.map(product => <article className="shop-page-card" key={product.id}><img src={product.imageUrl} alt={product.name}/><div><span className="stock">{product.stock} in stock</span><h2>{product.name}</h2><strong>{new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(product.priceCents / 100)}</strong><Link className="primary shop-buy" href="/login"><LockKeyhole size={14}/> LOG IN TO BUY</Link></div></article>)}</section></main>;
}
