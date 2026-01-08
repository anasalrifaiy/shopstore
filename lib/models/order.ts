import { Collection, ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import { Order, OrderStatus } from '@/types';

export class OrderModel {
  private static async getCollection(): Promise<Collection<Order>> {
    const db = await getDatabase();
    return db.collection<Order>(COLLECTIONS.ORDERS);
  }

  static async create(order: Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'orderNumber'>): Promise<Order> {
    const collection = await this.getCollection();
    const now = new Date();

    // Generate order number (format: ORD-YYYYMMDD-XXXXX)
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const orderNumber = `ORD-${dateStr}-${randomNum}`;

    const newOrder = {
      ...order,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newOrder as any);
    return { ...newOrder, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<Order | null> {
    const collection = await this.getCollection();
    const order = await collection.findOne({ _id: new ObjectId(id) } as any);
    if (!order) return null;
    return { ...order, _id: order._id.toString() };
  }

  static async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const collection = await this.getCollection();
    const order = await collection.findOne({ orderNumber } as any);
    if (!order) return null;
    return { ...order, _id: order._id.toString() };
  }

  static async findByUserId(userId: string): Promise<Order[]> {
    const collection = await this.getCollection();
    const orders = await collection
      .find({ userId } as any)
      .sort({ createdAt: -1 })
      .toArray();
    return orders.map((o) => ({ ...o, _id: o._id.toString() }));
  }

  static async findByEmail(email: string): Promise<Order[]> {
    const collection = await this.getCollection();
    const orders = await collection
      .find({ customerEmail: email } as any)
      .sort({ createdAt: -1 })
      .toArray();
    return orders.map((o) => ({ ...o, _id: o._id.toString() }));
  }

  static async findAll(
    filters: { status?: OrderStatus; limit?: number; skip?: number } = {}
  ): Promise<Order[]> {
    const collection = await this.getCollection();
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    const orders = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filters.skip || 0)
      .limit(filters.limit || 50)
      .toArray();

    return orders.map((o) => ({ ...o, _id: o._id.toString() }));
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    return { ...result, _id: result._id.toString() };
  }

  static async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    return { ...result, _id: result._id.toString() };
  }

  static async getStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    shippedOrders: number;
  }> {
    const collection = await this.getCollection();

    const [totalOrders, revenue, pendingOrders, shippedOrders] = await Promise.all([
      collection.countDocuments({}),
      collection.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]).toArray(),
      collection.countDocuments({ status: 'pending' } as any),
      collection.countDocuments({ status: 'shipped' } as any),
    ]);

    return {
      totalOrders,
      totalRevenue: revenue[0]?.total || 0,
      pendingOrders,
      shippedOrders,
    };
  }
}
