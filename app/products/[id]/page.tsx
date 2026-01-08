'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/lib/store/cart-store';
import { Product } from '@/types';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      productId: product._id!,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity,
      sku: product.sku,
    });

    // Show success message (you can add a toast notification here)
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to products
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Image thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {product.featured && (
                <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  Featured
                </span>
              )}

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      Save {discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              <div className="mb-6">
                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Stock status */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">In Stock ({product.stock} available)</p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>

              {/* Quantity selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" />
                Add to Cart
              </button>

              {/* Product details */}
              <div className="mt-8 border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">SKU:</dt>
                    <dd className="font-medium">{product.sku}</dd>
                  </div>
                  {product.supplierName && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Supplier:</dt>
                      <dd className="font-medium">{product.supplierName}</dd>
                    </div>
                  )}
                  {product.tags && product.tags.length > 0 && (
                    <div>
                      <dt className="text-gray-600 mb-2">Tags:</dt>
                      <dd className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
