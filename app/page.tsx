'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем, залогинен ли пользователь при загрузке страницы
  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      });
  }, []);
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleBuy = async (productId: number, price: number, title: string) => {
    const res = await fetch('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, price, title }),
    });

    const data = await res.json();
    
    if (res.ok) {
      setMessage(`Товар "${title}" успешно куплен!`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(data.error || 'Ошибка при покупке');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      
      {/* Уведомление */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-lg shadow-lg z-50 text-sm">
          {message}
        </div>
      )}

      {/* Шапка сайта */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="text-2xl font-bold tracking-tighter">MLM.SHOP</div>
        <nav className="flex gap-6 text-sm text-zinc-400">
          <a href="#catalog" className="hover:text-white transition">Каталог</a>
        </nav>
        {isLoggedIn ? (
          <a href="/dashboard" className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition">
            Мой кабинет
          </a>
        ) : (
          <a href="/login" className="bg-white text-black px-4 py-2 rounded-md font-medium text-sm hover:bg-zinc-200 transition">
            Войти
          </a>
        )}
      </header>

      {/* Главный экран */}
      <main className="flex flex-col items-center justify-center pt-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Зарабатывай с нами
        </h1>
        <p className="text-zinc-400 max-w-lg mb-8 text-lg">
          Покупай любимые вещи, приглашай друзей и получай бонусы на свой баланс.
        </p>
        <a href="/register" className="bg-white text-black px-8 py-3 rounded-md font-medium text-lg hover:bg-zinc-200 transition">
  Начать сейчас
</a>
      </main>

      {/* Каталог товаров */}
            {/* Каталог товаров */}
      <section className="max-w-6xl mx-auto px-8 pb-24 pt-16">
        <h2 id="catalog" className="text-3xl font-bold mb-8">Популярные товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {products.map((product) => (
            <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
              <img src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"} alt={product.title} className="h-48 w-full object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">{product.title}</h3>
              <p className="text-zinc-400 mb-4">{product.price} бонусов</p>
              <button 
                onClick={() => handleBuy(product.id, Number(product.price), product.title)}
                className="mt-auto bg-white text-black py-2 rounded-md font-medium hover:bg-zinc-200 transition"
              >
                Купить
              </button>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
}