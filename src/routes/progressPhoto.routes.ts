import { Router } from 'express';
import multer from 'multer';
import { uploadProgressPhoto, getProgressPhotos } from '../controllers/progressPhoto.controller';
import auth from '../middlewares/auth';

function asyncHandler(fn: any) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = Router();

router.post('/photo', auth, upload.single('photo'), asyncHandler(uploadProgressPhoto));
router.get('/photo', auth, asyncHandler(getProgressPhotos));

export default router;
