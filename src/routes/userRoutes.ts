import { Router } from 'express';
import { userController } from '../controllers';
import { auth } from '../middlewares';

const router = Router();

router
  .post('/', userController.postOneUser)
  .post('/login', userController.loginUser)
  .get('/profile', auth.verifyToken, userController.userProfileData);

export default router;
