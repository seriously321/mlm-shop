import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
    }

    // Создаем ответ и прикрепляем к нему куки
    const response = NextResponse.json({ success: true, userId: user.id });
    response.cookies.set('userId', user.id.toString(), { path: '/' });
    
    return response;
    
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}