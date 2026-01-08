import { Collection, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDatabase, COLLECTIONS } from '../mongodb';
import { User } from '@/types';

export class UserModel {
  private static async getCollection(): Promise<Collection<User>> {
    const db = await getDatabase();
    return db.collection<User>(COLLECTIONS.USERS);
  }

  static async create(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const collection = await this.getCollection();
    const now = new Date();

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(newUser as any);
    const user = { ...newUser, _id: result.insertedId.toString() };

    // Remove password from returned object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  static async findById(id: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ _id: new ObjectId(id) } as any);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() } as User;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email: email.toLowerCase() } as any);
    if (!user) return null;
    return { ...user, _id: user._id.toString() };
  }

  static async verifyPassword(email: string, password: string): Promise<User | null> {
    const collection = await this.getCollection();
    const user = await collection.findOne({ email: email.toLowerCase() } as any);

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: user._id.toString() } as User;
  }

  static async update(id: string, updates: Partial<User>): Promise<User | null> {
    const collection = await this.getCollection();

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) } as any,
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!result) return null;

    const { password, ...userWithoutPassword } = result;
    return { ...userWithoutPassword, _id: result._id.toString() } as User;
  }

  static async delete(id: string): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) } as any);
    return result.deletedCount > 0;
  }

  static async createIndexes(): Promise<void> {
    const collection = await this.getCollection();
    await collection.createIndex({ email: 1 }, { unique: true });
  }
}
