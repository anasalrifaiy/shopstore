import { NextRequest, NextResponse } from 'next/server';
import { OrderModel } from '@/lib/models/order';
import { ApiResponse, OrderStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await OrderModel.findById(id);

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // TODO: Add authentication check - only admins should update orders

    const order = await OrderModel.update(id, body);

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: order,
      message: 'Order updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating order:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update order',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const order = await OrderModel.updateStatus(id, status as OrderStatus);

    if (!order) {
      const response: ApiResponse = {
        success: false,
        error: 'Order not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: order,
      message: 'Order status updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update order status',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
