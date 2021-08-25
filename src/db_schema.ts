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
  createAt: { // createdAt 이 맞아요
    type: Date,
    required: true,
    default: new Date(),
  },
  modifiedAt: { // updatedAt을 많이 사용해요
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

// 음 그리고 이거 이렇게 분리하신건 잘 생각하셨는데
// 더 분리해야해요
// 아 폴더 색깔 안바뀌는거 뭐지? 이거 vscode-icons인가? 원래 안되는근 크훔;;
// 뭐 폴더 이름은 상관없는데.. 오직 db쪽 로직만 따로 분리대야함
// 그리고 이것도 각 스키마끼리 또 폴더로 분리대는게 좋아요
// 이게 타입 추론이 안된이유가 님이 타입을 지정해주지 않아서 그럼

export { boardSchema };
export default {};
