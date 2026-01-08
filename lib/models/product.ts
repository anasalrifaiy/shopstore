import { Collection, ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import { Product, ProductFilters, PaginationParams } from '@/types';

export class ProductModel {
  private static async getCollection(): Promise<Collection<Product>> {
    const db = await getDatabase();
    return db.collection<Product>(COLLECTIONS.PRODUCTS);
  }

  static async create(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const collection = await this.getCollection();
    const now = new Date();
    const newProduct = {
      ...product,
      createdAt: now,
      updatedAt: now,
    };
    const result = await collection.insertOne(newProduct as any);
    return { ...newProduct, _id: result.insertedId.toString() };
  }

  static async findById(id: string): Promise<Product | null> {
    const collection = await this.getCollection();
    const product = await collection.findOne({ _id: new ObjectId(id) } as any);
    if (!product) return null;
    return { ...product, _id: product._id.toString() };
  }

  static async findAll(
    filters: ProductFilters = {},
    pagination: PaginationParams = { page: 1, limit: 12 }
  ): Promise<{ products: Product[]; total: number }> {
    const collection = await this.getCollection();
    const query: any = { active: true };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.featured !== undefined) {
      query.featured = filters.featured;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { tags: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const sortField = pagination.sortBy || 'createdAt';
    const sortOrder = pagination.sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      collection
        .find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(pagination.limit)
        .toArray(),
      collection.countDocuments(query),
    ]);

    return {
      products: products.map((p) => ({ ...p, _id: p._id.toString() })),
      total,
    };
  }

  static async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    const collection = await this.getCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return null;
    return { ...result, _id: result._id.toString() };
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any);
    return result.deletedCount > 0;
  }

  static async getFeatured(limit: number = 8): Promise<Product[]> {
    const collection = await this.getCollection();
    const products = await collection
      .find({ featured: true, active: true } as any)
      .limit(limit)
      .toArray();
    return products.map((p) => ({ ...p, _id: p._id.toString() }));
  }

  static async getCategories(): Promise<string[]> {
    const collection = await this.getCollection();
    const categories = await collection.distinct('category', { active: true } as any);
    return categories;
  }
}
