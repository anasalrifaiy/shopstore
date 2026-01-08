'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Order } from '@/types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get('success') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-green-900">Order Confirmed!</h2>
            </div>
            <p className="text-green-800">
              Thank you for your order. We've sent a confirmation email to{' '}
              <strong>{order.customerEmail}</strong>
            </p>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {order.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-b py-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
            <p className="text-gray-700">{order.shippingAddress.fullName}</p>
            <p className="text-gray-700">{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p className="text-gray-700">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-gray-700">
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p className="text-gray-700">{order.shippingAddress.country}</p>
            <p className="text-gray-700">{order.shippingAddress.phone}</p>
          </div>

          {/* Tracking Information */}
          {order.trackingNumbers && order.trackingNumbers.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-2">Tracking Information</h3>
              {order.trackingNumbers.map((tracking, index) => (
                <div key={index} className="text-gray-700">
                  <p>
                    <strong>{tracking.carrier}:</strong> {tracking.trackingNumber}
                  </p>
                  {tracking.url && (
                    <a
                      href={tracking.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Track package →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/products"
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
