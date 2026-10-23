'use client'
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <div className="min-h-screen bg-zinc-950 text-white p-8">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-10 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-4">
            <a href="/" className="text-zinc-400 hover:text-white transition text-sm">← На главную</a>
            <h1 className="text-2xl font-bold">Личный кабинет ({user.username})</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="/ai" className="bg-zinc-800 text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-700 transition border border-zinc-700">
              Спросить ИИ
            </a>
            <button 
              onClick={async () => {
                document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                window.location.href = "/";
              }} 
              className="text-zinc-400 hover:text-white transition"
            >
              Выйти
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Блок баланса */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-zinc-400 mb-2">Ваш баланс</h2>
            <p className="text-4xl font-bold text-green-400">{user.balance} б.</p>
          </div>

          {/* Блок рефералки */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h2 className="text-zinc-400 mb-2">Ваша реферальная ссылка</h2>
            <div className="flex gap-2 mt-4">
              <input 
                type="text" 
                readOnly 
                value={`http://localhost:3000/register?ref=${user.id}`} 
                className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-2 text-sm text-zinc-300 focus:outline-none"
              />
                            <button 
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:3000/register?ref=${user.id}`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className={`px-4 rounded-md text-sm font-medium transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-zinc-200'}`}
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        {/* История операций */}
                {/* Мои рефералы */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Мои рефералы</h2>
          <div className="flex flex-col gap-3">
            {!user.referrals || user.referrals.length === 0 ? (
              <div className="text-zinc-500 text-sm">Вы пока никого не пригласили.</div>
            ) : (
              user.referrals.map((ref: any) => (
                <div key={ref.id} className="flex justify-between border-b border-zinc-800 pb-2">
                  <span>Пользователь: {ref.username}</span>
                  <span className="text-green-400">Активен</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}