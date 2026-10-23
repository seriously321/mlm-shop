'use client'
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Привет! Я твой ИИ-помощник. Помогу разобраться, как зарабатывать бонусы и приглашать друзей. Что тебя интересует?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Добавляем сообщение пользователя
    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Имитация ответа ИИ
    setTimeout(() => {
      let aiResponse = 'Я пока учусь, но скоро смогу отвечать на любые вопросы!';
      
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('приглас') || lowerInput.includes('друг') || lowerInput.includes('реферал')) {
        aiResponse = 'Чтобы пригласить друга, зайди в свой личный кабинет, скопируй свою реферальную ссылку и отправь её другу. Когда он зарегистрируется по ней, ты получишь 100 бонусов!';
      } else if (lowerInput.includes('бонус') || lowerInput.includes('деньг') || lowerInput.includes('баланс')) {
        aiResponse = 'Бонусы можно тратить в нашем каталоге товаров. Заходи в раздел "Каталог", выбирай нужный товар и нажимай "Купить". Бонусы спишутся с твоего баланса.';
      } else if (lowerInput.includes('привет') || lowerInput.includes('здравств')) {
        aiResponse = 'Привет-привет! Готов помочь тебе заработать первые бонусы. С чего начнем?';
      }

      setMessages([...newMessages, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col">
      {/* Шапка */}
      <header className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <a href="/dashboard" className="text-zinc-400 hover:text-white transition">← Назад</a>
          <h1 className="text-xl font-bold">ИИ-Ассистент</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Онлайн
        </div>
      </header>

      {/* Окно чата */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full flex flex-col gap-4 pb-24">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white text-black rounded-br-none' : 'bg-zinc-800 text-zinc-100 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-zinc-800 p-4 rounded-2xl rounded-bl-none flex gap-1">
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce delay-200"></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Задай вопрос..." 
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-zinc-500"
          />
          <button 
            onClick={handleSend}
            className="bg-white text-black px-6 rounded-xl font-medium hover:bg-zinc-200 transition"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}