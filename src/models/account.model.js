import { mongoose } from '../databases/index.js'
import { permissions } from '../configs/permissions.config.js'

const schema = new mongoose.Schema({
  avatar: {
    type: String
  },
  fullName: {
    type: String,
    require: true
  },
  username: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  permissions: {
    type: [String],
    default: [permissions.SALESPERSON]
  },
  isActive: {
    type: Boolean,
    default: true,
    require: true
  },
  isLocked: {
    type: Boolean,
    default: false,
    require: true
  },
  isFirstLogin: {
    type: Boolean,
    default: true // Đặt thành true khi tạo user mới
  }
}, {
  timestamps: true
})

const Account = mongoose.model('account', schema)

// await model.createIndexes({
//   username: 1,
// });

export default Account

export {
  Account
}
