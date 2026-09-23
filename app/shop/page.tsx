'use client';

import Link from 'next/link';
import { ArrowLeft, LockKeyhole } from 'lucide-react';

const products = [
  { name: 'Home Jersey 26/27', price: 'R899', stock: 18, image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=900&q=80' },
  { name: 'United Training Tee', price: 'R449', stock: 32, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=80' },
  { name: 'Heritage Cap', price: 'R299', stock: 9, image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80' }
];
export default function ShopPage() {
  return <main className="section-page"><header className="section-page-nav"><Link href="/" className="brand"><span className="crest">DU</span><span>DURBAN<br />UNITED</span></Link><Link href="/" className="back-link"><ArrowLeft size={15}/> Back to home</Link></header><section className="section-page-hero"><div className="eyebrow">THE UNITED STORE</div><h1>Wear the feeling.</h1><p>Official matchday pieces, training essentials and coastal heritage. Browse stock freely; sign in before checkout.</p></section><section className="shop-page-grid">{products.map(product => <article className="shop-page-card" key={product.name}><img src={product.image} alt={product.name}/><div><span className="stock">{product.stock} in stock</span><h2>{product.name}</h2><strong>{product.price}</strong><Link className="primary shop-buy" href="/login"><LockKeyhole size={14}/> LOG IN TO BUY</Link></div></article>)}</section></main>;
}
