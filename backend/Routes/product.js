import express from 'express';

import { isAuth } from '../middleware/isAuth.js';
import { createProduct } from '../controller/product.js';
import { uploadFiles } from '../middleware/multer.js';

const router=express.Router();
router.post("/product/new",isAuth,uploadFiles,createProduct)
export default router;
