'use client'
import { useState, useEffect } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [referrer, setReferrer] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
      setReferrer(ref);
    }
  }, []);

  const handleRegister = async () => {
    // Проверка на английский язык и длину
    const englishRegex = /^[a-zA-Z0-9_]+$/;
    
    if (!englishRegex.test(username)) {
      setMessage('Логин должен содержать только английские буквы и цифры');
      return;
    }
    if (!englishRegex.test(password)) {
      setMessage('Пароль должен содержать только английские буквы и цифры');
      return;
    }
    if (username.length > 20 || password.length > 20) {
      setMessage('Логин и пароль не должны превышать 20 символов');
      return;
    }
    if (username.length < 5 || password.length < 5) {
      setMessage('Логин и пароль должны быть не менее 5 символов');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username, 
        password, 
        referrerId: referrer ? parseInt(referrer) : null 
      }),
    });

    const data = await res.json();
    
    if (res.ok) {
      setMessage('Успешно! Аккаунт создан.');
    } else {
      setMessage(data.error || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Регистрация</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Логин</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-zinc-500" 
              placeholder="Только латиница, до 20 символов" 
              pattern="^[a-zA-Z0-9_]+$"
              minLength={5}
              maxLength={20}
              title="Используйте только английские буквы, цифры и нижнее подчеркивание"
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-zinc-500" 
              placeholder="Только латиница, до 20 символов" 
              pattern="^[a-zA-Z0-9_]+$"
              minLength={5}
              maxLength={20}
              title="Используйте только английские буквы, цифры и нижнее подчеркивание"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Код приглашения (если есть)</label>
            <input 
              type="text" 
              value={referrer}
              onChange={(e) => setReferrer(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-zinc-500" 
              placeholder="Например: 2" 
            />
          </div>

          <button 
            onClick={handleRegister}
            className="bg-white text-black font-medium py-3 rounded-md mt-4 hover:bg-zinc-200 transition"
          >
            Создать аккаунт
          </button>
          
          {message && <p className="text-center text-sm mt-2">{message}</p>}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Уже есть аккаунт? <a href="/login" className="text-white hover:underline">Войти</a>
        </p>
      </div>
    </div>
  );
}