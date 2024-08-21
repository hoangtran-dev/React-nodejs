// routes/userRoutes.js
import express from 'express';
import { likeProduct, unlikeProduct, getLikedProducts } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Thêm sản phẩm vào danh sách đã thích
router.post('/like/:productId', authMiddleware, likeProduct);

// Bỏ thích sản phẩm
router.post('/unlike/:productId', authMiddleware, unlikeProduct);

// Lấy danh sách sản phẩm đã thích của người dùng
router.get('/liked-products', authMiddleware, getLikedProducts);

export default router;
