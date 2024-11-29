import { mongoose } from '../databases/index.js'


const schema = new mongoose.Schema({
  barcode: {
    type: String,
    unique: true,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  importPrice: {
    type: Number,
    require: true
  },
  retailPrice: {
    type: Number,
    require: true
  },
  category: {
    type: String,
    require: true
  },
  quantity: {
    type: Number,
    require: true,
    default: 0
  }
}, {
  timestamps: true
})

const Product = mongoose.model('product', schema)

// await model.createIndexes({
//   barcode: 1,
// });

export default Product

export {
  Product
}
