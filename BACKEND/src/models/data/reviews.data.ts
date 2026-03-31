import { ObjectId } from 'mongodb'
import Review from '~/models/schemas/Review.schema'

const mockReviews: Review[] = [
  new Review({
    _id: new ObjectId('777000000000000000000001'),
    productID: new ObjectId('666000000000000000000001'), // MacBook Pro M3
    userID: 'user-001',
    userName: 'Nguyen Van A',
    rating: 5,
    comment: 'Sản phẩm tuyệt vời, hiệu năng mạnh mẽ, pin trâu cả ngày.',
    images: [],
    createdAt: new Date('2026-02-01T08:00:00Z'),
    updatedAt: new Date('2026-02-01T08:00:00Z')
  }),
  new Review({
    _id: new ObjectId('777000000000000000000002'),
    productID: new ObjectId('666000000000000000000001'), // MacBook Pro M3
    userID: 'user-002',
    userName: 'Tran Thi B',
    rating: 4,
    comment: 'Rất tốt, nhưng giá hơi cao. Màn hình đẹp, bàn phím thoải mái.',
    images: [],
    createdAt: new Date('2026-02-05T10:30:00Z'),
    updatedAt: new Date('2026-02-05T10:30:00Z')
  }),
  new Review({
    _id: new ObjectId('777000000000000000000003'),
    productID: new ObjectId('666000000000000000000004'), // iPhone 15 Pro
    userID: 'user-001',
    userName: 'Nguyen Van A',
    rating: 5,
    comment: 'Camera quá đỉnh, thiết kế titanium sang trọng, chip A17 Pro siêu nhanh.',
    images: ['https://example.com/review-img-1.jpg'],
    createdAt: new Date('2026-02-10T14:00:00Z'),
    updatedAt: new Date('2026-02-10T14:00:00Z')
  }),
  new Review({
    _id: new ObjectId('777000000000000000000004'),
    productID: new ObjectId('666000000000000000000005'), // Samsung S24 Ultra
    userID: 'user-003',
    userName: 'Le Van C',
    rating: 5,
    comment: 'S Pen rất tiện, màn hình to sắc nét. Galaxy AI thông minh.',
    images: [],
    createdAt: new Date('2026-02-12T09:00:00Z'),
    updatedAt: new Date('2026-02-12T09:00:00Z')
  }),
  new Review({
    _id: new ObjectId('777000000000000000000005'),
    productID: new ObjectId('666000000000000000000002'), // Dell XPS 15
    userID: 'user-002',
    userName: 'Tran Thi B',
    rating: 4,
    comment: 'Màn hình OLED 4K cực đẹp, máy hơi nóng khi tải nặng.',
    images: [],
    createdAt: new Date('2026-02-15T11:00:00Z'),
    updatedAt: new Date('2026-02-15T11:00:00Z')
  })
]

export default mockReviews
