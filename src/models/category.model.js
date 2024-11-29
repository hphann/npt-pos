import { mongoose } from '../databases/index.js'

const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    require: true
  }
}, {
  timestamps: true
})

const Category = mongoose.model('category', schema)

export default Category

// await model.createIndexes({
//   barcode: 1,
// });


