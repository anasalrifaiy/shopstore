'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCartStore } from '@/lib/store/cart-store';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id!,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder.jpg',
      quantity: 1,
      sku: product.sku,
    });
  };

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product._id}`}>
      <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 text-xs font-semibold rounded">
              Featured
            </div>
          )}
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              -{discountPercentage}%
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{product.category}</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Add to cart"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>

          {product.stock < 10 && product.stock > 0 && (
            <p className="text-xs text-orange-600 mt-2">
              Only {product.stock} left in stock!
            </p>
          )}
          {product.stock === 0 && (
            <p className="text-xs text-red-600 mt-2">Out of stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}
