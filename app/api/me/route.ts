import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  }

    const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: { 
      transactions: true,
      referrals: true // Добавляем загрузку приглашенных
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
  }

  // Убираем хэш пароля из ответа
  const { passwordHash, ...safeUser } = user;
  return NextResponse.json(safeUser);
}