"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductMarketPage() {
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/product_reader')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      });
  }, []);
  console.log(products);
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24, fontWeight: 700, fontSize: '2em', color: '#1976d2' }}>Products</h2>
      <div className="tiles" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-evenly',overflow:'hidden' }}>
        {products.map((item, idx) => (
          <div
            key={idx}
            className="tile"
            style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 6px #eee', padding: 12, cursor: 'pointer' }}
            onClick={() => router.push(`/app/${encodeURIComponent(item.product_name || item.name)}`)}
          >
            <img src={item.img_url || item.image || '/placeholder.jpg'} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 8 }} />
            <span style={{ display: 'block', fontWeight: 600, marginTop: 8 }}>{item.product_name || item.name}</span>
            <div style={{ fontWeight: 600, color: '#1976d2', marginTop: 8,display:'inline-flex' }}>
               <img src="/coin.png" alt="coin" style={{ height: '24px', width: '24px', marginRight: 6,transform:'translateY(25%)' }}/>{item.our_price || item.price ? `${item.our_price || item.price}` : 'Price not available'}
            </div>
            <div style={{ color: '#888', fontSize: '0.9em', marginTop: 4 }}>{item.type}</div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ color: '#888', marginTop: 16 }}>No products found.</div>
        )}
      </div>
    </div>
  );
}
