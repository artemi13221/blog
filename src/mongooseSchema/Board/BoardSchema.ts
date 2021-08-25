import {
  Document, Schema, model,
} from 'mongoose';

interface Board extends Document {
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<Board>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, required: true, default: new Date() },
  updatedAt: { type: Date, required: true, default: new Date() },
}, {
  collection: 'boards',
  timestamps: true, // 이 값을 true로 바꾸면 createdAt, updatedAt이 자동으로 들어가요
});

// 그리고 여기에서 모델을 export 합니다.
export const BoardModel = model<Board>('boards', boardSchema);
