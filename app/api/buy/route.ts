import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Сначала войдите в аккаунт' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, price, title } = body;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем, хватает ли бонусов
    if (Number(user.balance) < price) {
      return NextResponse.json({ error: 'Недостаточно бонусов на балансе' }, { status: 400 });
    }

    // Списываем баланс и создаем запись в истории
    await prisma.user.update({
      where: { id: user.id },
      data: {
        balance: { decrement: price },
        transactions: {
          create: {
            amount: -price,
            description: `Покупка: ${title}`
          }
        }
      }
    });

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при покупке' }, { status: 500 });
  }
}