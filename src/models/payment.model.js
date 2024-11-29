import { mongoose } from '../databases/index.js'

const schema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'orders',
    required: true
  },
  paymentDate: {
    type: Date,
    required: true
  },
  receive: {
    // Số tiền nhận từ khách
    type: Number,
    require: true
  },
  remain: {
    // Số tiền còn dư
    type: Number,
    require: true
  }
}, {
  timestamps: true
})

const Payment = mongoose.model('payment', schema)

// await model.createIndexes({
//   customer: 1,
// });
//
// await model.createIndexes({
//   employee: 1,
// });

export default Payment

export {
  Payment
}
