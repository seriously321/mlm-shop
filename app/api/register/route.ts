import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, referrerId } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Заполни логин и пароль' }, { status: 400 });
    }

    // Проверяем, нет ли уже такого пользователя
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Такой логин уже занят' }, { status: 400 });
    }

    // Создаем пользователя
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash: password,
        referrerId: referrerId ? parseInt(referrerId) : null,
      }
    });

    // Если есть реферер, начисляем ему бонусы
    if (referrerId) {
      const bonus = 100; // Размер бонуса за друга
      
      // Обновляем баланс реферера и пишем ему историю
      await prisma.user.update({
        where: { id: parseInt(referrerId) },
        data: {
          balance: { increment: bonus },
          transactions: {
            create: {
              amount: bonus,
              description: `Бонус за приглашение пользователя ${username}`
            }
          }
        }
      });
    }

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}