"use client";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
export default function ProductDetailPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' }) // Adjust as needed
      });
      const data = await res.json();
      if (data.user && data.user.username) {
        setUsername(data.user.username);
      }
    };
    fetchProfile();
  }, []);

  const handleBuy = async () => {
    const price = Number(product.our_price || product.price);
    const user = username;
    const type = "deposit";
    const remarks = `Buy ${product.product_name || product.name}`;
    try {
      const res = await fetch('/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, amount: price, type, remarks }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Order confirmed, it will be delivered to your office');
      } else {
        toast.error('fooooff');
      }
    } catch (err) {
      toast.error('Transaction failed');
    }
  };
  const { product_name } = useParams();
  const [product, setProduct] = useState(null);
  const formattedProductName = product_name
    .replace(/%20/g, " ");
  console.log(formattedProductName);
  useEffect(() => {
    fetch("/api/product_reader")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.products)) {
          const found = data.products.find(
            (item) =>
              item.product_name === formattedProductName ||
              item.name === product_name
          );
          setProduct(found || null);
        }
      });
  }, [product_name]);

  if (!product) {
    return <div style={{ padding: 32,color:"black" }}>Product not found.</div>;
  }

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      
      <h1 style={{ fontSize: "2em", fontWeight: 700, marginBottom: 24 }}>
        {product.product_name || product.name}
      </h1>
      <img
        src={product.img_url || product.image || "/placeholder.jpg"}
        alt={product.product_name || product.name}
        style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 12, marginBottom: 24 }}
      />
      <div style={{ fontWeight: 600, color: "#1976d2", fontSize: "1.5em", marginBottom: 16 }}>
        ₹{product.our_price || product.price}
      </div>
      <div style={{ color: "#888", fontSize: "1.1em", marginBottom: 16 }}>
        Type: {product.type}
      </div>
      <button
        style={{
          padding: '12px 32px',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: '1.1em',
          cursor: 'pointer',
          marginTop: 24,
        }}
        onClick={handleBuy}
      >
        Buy Now
      </button>
      {/* Add more product details here if needed */}
    </div>
  );
}
