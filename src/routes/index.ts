import { Router } from 'express';
import userRoutes from './userRoutes';

const mainRouter = Router();

mainRouter.use('/user', userRoutes);

export default mainRouter;
