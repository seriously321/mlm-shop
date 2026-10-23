'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
      });
      
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      });
  }, []);

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.2;
    audio.play();
  };

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
        <motion.div 
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-4 left-1/2 bg-zinc-800 border border-zinc-700 px-6 py-3 rounded-lg shadow-lg z-50 text-sm"
        >
          {message}
        </motion.div>
      )}

      {/* Шапка сайта */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-800">
        <div className="text-2xl font-bold tracking-tighter pl-12">
  MLM.SHOP
</div>
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
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
        >
          Зарабатывай с нами
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 max-w-lg mb-8 text-lg"
        >
          Покупай любимые вещи, приглашай друзей и получай бонусы на свой баланс.
        </motion.p>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255, 255, 255, 0.4)" }}
          className="bg-white text-black px-8 py-3 rounded-md font-medium text-lg transition-colors"
          onClick={playClickSound}
        >
          Начать сейчас
        </motion.button>
      </main>

      {/* Каталог товаров */}
      <section className="max-w-6xl mx-auto px-8 pb-24 pt-16">
        <h2 id="catalog" className="text-3xl font-bold mb-8">Популярные товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {isLoading ? (
            // Скелетоны во время загрузки
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col animate-pulse">
                <div className="h-48 w-full bg-zinc-800 rounded-lg mb-4"></div>
                <div className="h-6 bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-800 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-zinc-800 rounded mt-auto"></div>
              </div>
            ))
          ) : (
            // Карточки товаров
            products.map((product, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ scale: 1.03, borderColor: "#52525b" }}
                key={product.id} 
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col"
              >
                <img src={product.imageUrl || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"} alt={product.title} className="h-48 w-full object-cover rounded-lg mb-4" />
                <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                <p className="text-zinc-400 mb-4">{product.price} бонусов</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound();
                    handleBuy(product.id, Number(product.price), product.title);
                  }}
                  className="mt-auto bg-white text-black py-2 rounded-md font-medium hover:bg-zinc-200 transition"
                >
                  Купить
                </motion.button>
              </motion.div>
            ))
          )}

        </div>
      </section>

    </div>
  );
}