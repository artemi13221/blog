import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  modifiedAt: {
    type: Date,
    required: true,
  },
}, { collection: 'board' });

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
// });

export { boardSchema };
export default {};
