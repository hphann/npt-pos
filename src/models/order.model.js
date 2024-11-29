import { mongoose } from '../databases/index.js'

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'customer',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    required: true
  }
}, {
  timestamps: true
})

const Order = mongoose.model('order', orderSchema)

export default Order

export {
  Order
}