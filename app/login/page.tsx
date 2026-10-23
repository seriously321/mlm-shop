'use client'
import { useState } from 'react';
import { motion } from 'framer-motion';
import { playSound } from '@/utils/playSound';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    
    if (res.ok) {
      // Если вход успешен, перекидываем в кабинет
      window.location.href = '/dashboard';
    } else {
      setMessage(data.error || 'Ошибка входа');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Вход</h1>
        
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Логин</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-zinc-500" 
              placeholder="Твой логин" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-md p-3 text-white focus:outline-none focus:border-zinc-500" 
              placeholder="••••••••" 
            />
          </div>

          <button 
  onClick={() => {
    playSound();
    handleLogin();
  }}
  className="bg-white text-black font-medium py-3 rounded-md mt-4 hover:bg-zinc-200 transition"
>
  Войти
</button>
          
          {message && <p className="text-center text-red-400 text-sm mt-2">{message}</p>}
          
                    <p className="text-center text-zinc-500 text-sm mt-4">
            Нет аккаунта? <a href="/register" className="text-white hover:underline">Зарегистрироваться</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}