import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/lib/models/product';
import { ApiResponse, ProductFilters, PaginationParams } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Build filters
    const filters: ProductFilters = {};
    if (searchParams.get('category')) filters.category = searchParams.get('category')!;
    if (searchParams.get('search')) filters.search = searchParams.get('search')!;
    if (searchParams.get('minPrice')) filters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) filters.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('featured')) filters.featured = searchParams.get('featured') === 'true';
    if (searchParams.get('tags')) filters.tags = searchParams.get('tags')!.split(',');

    // Build pagination
    const pagination: PaginationParams = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    };

    const { products, total } = await ProductModel.findAll(filters, pagination);

    const response: ApiResponse = {
      success: true,
      data: {
        products,
        pagination: {
          page: pagination.page,
          limit: pagination.limit,
          total,
          pages: Math.ceil(total / pagination.limit),
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch products',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check - only admins should create products
    // const session = await getServerSession();
    // if (!session || session.user.role !== 'admin') {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    const product = await ProductModel.create(body);

    const response: ApiResponse = {
      success: true,
      data: product,
      message: 'Product created successfully',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to create product',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
