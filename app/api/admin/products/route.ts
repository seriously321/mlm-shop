import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, imageUrl } = body;

    const product = await prisma.product.create({
      data: { title, price, imageUrl }
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при создании' }, { status: 500 });
  }
}