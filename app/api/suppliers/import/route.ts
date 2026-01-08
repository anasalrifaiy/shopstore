import { NextRequest, NextResponse } from 'next/server';
import { ProductModel } from '@/lib/models/product';
import { ApiResponse } from '@/types';

/**
 * Supplier Import API
 *
 * This endpoint allows you to import products from supplier APIs or CSV files.
 * You can integrate with various dropshipping suppliers like AliExpress, Printful, etc.
 *
 * Example request body:
 * {
 *   "products": [
 *     {
 *       "name": "Product Name",
 *       "description": "Product Description",
 *       "price": 29.99,
 *       "supplierName": "Supplier Name",
 *       "supplierUrl": "https://supplier.com/product",
 *       "supplierPrice": 15.00,
 *       "images": ["https://example.com/image.jpg"],
 *       "category": "Electronics",
 *       "sku": "PROD-001",
 *       "stock": 100,
 *       "tags": ["tag1", "tag2"]
 *     }
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check - only admins should import products
    // const apiKey = request.headers.get('X-API-Key');
    // if (!apiKey || apiKey !== process.env.SUPPLIER_API_KEY) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    if (!body.products || !Array.isArray(body.products)) {
      return NextResponse.json(
        { success: false, error: 'Products array is required' },
        { status: 400 }
      );
    }

    const importedProducts = [];
    const errors = [];

    for (const productData of body.products) {
      try {
        // Validate required fields
        if (!productData.name || !productData.price || !productData.sku) {
          errors.push({
            product: productData.name || 'Unknown',
            error: 'Missing required fields (name, price, sku)',
          });
          continue;
        }

        // Create the product
        const product = await ProductModel.create({
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          compareAtPrice: productData.compareAtPrice,
          images: productData.images || [],
          category: productData.category || 'Uncategorized',
          supplierUrl: productData.supplierUrl,
          supplierName: productData.supplierName,
          supplierPrice: productData.supplierPrice,
          stock: productData.stock || 0,
          sku: productData.sku,
          tags: productData.tags || [],
          featured: productData.featured || false,
          active: productData.active !== false, // Default to active
        });

        importedProducts.push(product);
      } catch (error) {
        errors.push({
          product: productData.name || 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const response: ApiResponse = {
      success: true,
      data: {
        imported: importedProducts.length,
        failed: errors.length,
        products: importedProducts,
        errors,
      },
      message: `Successfully imported ${importedProducts.length} product(s)`,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error importing products:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to import products',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * Get supplier integration status
 */
export async function GET() {
  const response: ApiResponse = {
    success: true,
    data: {
      message: 'Supplier integration API is ready',
      endpoints: {
        import: '/api/suppliers/import',
        documentation: 'See README.md for integration details',
      },
      supportedFormats: ['JSON'],
      exampleIntegrations: [
        'AliExpress API',
        'Printful API',
        'Spocket API',
        'Custom CSV Import',
      ],
    },
  };

  return NextResponse.json(response);
}
