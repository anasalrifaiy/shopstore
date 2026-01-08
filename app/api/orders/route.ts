import { NextRequest, NextResponse } from 'next/server';
import { OrderModel } from '@/lib/models/order';
import { ApiResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let orders;

    if (email) {
      orders = await OrderModel.findByEmail(email);
    } else if (userId) {
      orders = await OrderModel.findByUserId(userId);
    } else {
      orders = await OrderModel.findAll({
        status: status as any,
        limit: Number(searchParams.get('limit')) || 50,
        skip: Number(searchParams.get('skip')) || 0,
      });
    }

    const response: ApiResponse = {
      success: true,
      data: orders,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch orders',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.customerEmail || !body.items || !body.shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the order
    const order = await OrderModel.create({
      userId: body.userId || 'guest',
      customerEmail: body.customerEmail,
      items: body.items,
      shippingAddress: body.shippingAddress,
      billingAddress: body.billingAddress || body.shippingAddress,
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      tax: body.tax || 0,
      total: body.total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentIntentId: body.paymentIntentId,
    });

    const response: ApiResponse = {
      success: true,
      data: order,
      message: 'Order created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
