import { Document, model, Schema } from 'mongoose';

interface Board extends Document {
  poster: string;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: boolean;
}

const boardSchema = new Schema<Board>({
  poster: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  deletedAt: { type: Date },
  isDeleted: { type: Boolean, required: true },
}, {
  timestamps: true,
});

export const BoardModel = model<Board>('boards', boardSchema);
