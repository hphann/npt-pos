import { mongoose } from '../databases/index.js'

const schema = new mongoose.Schema({
  phone: {
    type: String,
    require: true,
    unique: true
  },
  name: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  }
}, {
  timestamps: true
})

const Customer = mongoose.model('customer', schema)

// await model.createIndexes({
//   phone: 1,
// });

export default Customer

export {
  Customer
}
