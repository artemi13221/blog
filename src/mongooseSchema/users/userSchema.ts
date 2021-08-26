import { Document, model, Schema } from 'mongoose';

// User role enum
const userRole = ['admin', 'guest'];

interface User extends Document {
  id: string;
  pw: string;
  name: string;
  role: 'admin' | 'guest';
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
}

const userSchema = new Schema<User>({
  id: { type: String, required: true, unique: true },
  pw: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: userRole,
    default: 'guest',
  },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  isDeleted: { type: Boolean, required: true },
  deletedAt: { type: Date },
}, {
  timestamps: true,
});

export const UserModel = model<User>('users', userSchema);
