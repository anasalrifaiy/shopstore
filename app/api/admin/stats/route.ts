import { NextResponse } from 'next/server';
import { OrderModel } from '@/lib/models/order';
import { ApiResponse } from '@/types';

export async function GET() {
  try {
    const stats = await OrderModel.getStats();

    const response: ApiResponse = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch stats',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
