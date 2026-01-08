import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/lib/models/product';
import { ApiResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await ProductModel.findById(id);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching product:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch product',
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

    // TODO: Add authentication check - only admins should update products

    const product = await ProductModel.update(id, body);

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating product:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to update product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // TODO: Add authentication check - only admins should delete products

    const deleted = await ProductModel.delete(id);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        error: 'Product not found',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Product deleted successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to delete product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
