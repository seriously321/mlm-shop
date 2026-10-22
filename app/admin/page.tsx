'use client'
import { useState, useEffect } from 'react';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [bonusUsername, setBonusUsername] = useState('');
  const [bonusAmount, setBonusAmount] = useState('');
  const [bonusMessage, setBonusMessage] = useState('');

    const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        if (data.id === 1) {
          setIsAdmin(true);
        }
      });
  }, []);

  const fetchProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, price: Number(price), imageUrl }),
    });

    if (res.ok) {
      setMessage('Товар добавлен!');
      setTitle(''); setPrice(''); setImageUrl('');
      fetchProducts();
    } else {
      setMessage('Ошибка при добавлении');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };
    const handleGiveBonus = async () => {
    const res = await fetch('/api/admin/bonus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: bonusUsername, amount: Number(bonusAmount) }),
    });

    if (res.ok) {
      setBonusMessage('Бонусы начислены!');
      setBonusUsername(''); setBonusAmount('');
    } else {
      setBonusMessage('Ошибка: пользователь не найден');
    }
  };

    if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Доступ запрещен. Вы не администратор.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-6">Админка: Добавить товар</h1>
        
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} className="bg-zinc-950 border border-zinc-700 p-2 rounded" />
          <input type="number" placeholder="Цена (бонусы)" value={price} onChange={e => setPrice(e.target.value)} className="bg-zinc-950 border border-zinc-700 p-2 rounded" />
          <input type="text" placeholder="Ссылка на картинку" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="bg-zinc-950 border border-zinc-700 p-2 rounded" />
          
          <button onClick={handleAddProduct} className="bg-white text-black py-2 rounded font-medium mt-2">
            Добавить
          </button>
          
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Список товаров</h2>
          <div className="flex flex-col gap-2">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-zinc-950 p-3 rounded border border-zinc-800">
                <span>{p.title} — {p.price} б.</span>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-400 text-sm">Удалить</button>
              </div>
            ))}
            {products.length === 0 && <p className="text-zinc-500 text-sm">Товаров пока нет.</p>}
          </div>
        </div>
                    <div className="mt-10 pt-6 border-t border-zinc-800">
          <h2 className="text-xl font-bold mb-4">Начислить бонусы</h2>
          <div className="flex flex-col gap-3">
            <input type="text" placeholder="Логин пользователя" value={bonusUsername} onChange={e => setBonusUsername(e.target.value)} className="bg-zinc-950 border border-zinc-700 p-2 rounded" />
            <input type="number" placeholder="Сумма" value={bonusAmount} onChange={e => setBonusAmount(e.target.value)} className="bg-zinc-950 border border-zinc-700 p-2 rounded" />
            <button onClick={handleGiveBonus} className="bg-green-600 text-white py-2 rounded font-medium mt-1 hover:bg-green-500 transition">
              Начислить
            </button>
            {bonusMessage && <p className="text-center text-sm mt-1">{bonusMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}