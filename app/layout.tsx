'use client'
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const pathname = usePathname();
  const isAiPage = pathname === '/ai';

  return (
    <html lang="ru">
      <body className="bg-zinc-950 text-white font-sans relative">
        {children}

        {!isAiPage && (
          <>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="fixed bottom-6 right-6 bg-white text-black p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  className="fixed bottom-24 right-6 w-96 h-[600px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
                >
                  <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
                    <h3 className="font-bold">ИИ-Ассистент</h3>
                    <button onClick={() => setIsChatOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
                  </div>
                  <iframe src="/ai" className="w-full h-full border-none bg-zinc-950" />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </body>
    </html>
  );
}