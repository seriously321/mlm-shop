import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { username, amount } = await request.json();

    await prisma.user.update({
      where: { username },
      data: {
        balance: { increment: amount },
        transactions: { create: { amount, description: 'Начисление администратором' } }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
  }
}