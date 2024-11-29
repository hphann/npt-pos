import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Đường dẫn đến thư mục public/images
const uploadDir = path.join(__dirname, '..', 'public', 'images')

// Tạo thư mục nếu nó chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // giới hạn kích thước file 5MB
  }
})

const processImage = async (req, res, next) => {
  if (!req.file) return next()

  const safeFileName = req.file.originalname.replace(/[^a-z0-9.]/gi, '_').toLowerCase()
  const filename = `${Date.now()}-${safeFileName}`
  const outputPath = path.join(uploadDir, filename)

  try {
    await sharp(req.file.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(outputPath)

    req.file.filename = filename
    req.file.path = '/images/' + filename
    next()
  } catch (error) {
    console.error('Lỗi khi xử lý ảnh:', error)
    next(error)
  }
}

export { upload, processImage }