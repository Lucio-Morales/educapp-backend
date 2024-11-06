import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mainRouter from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/', mainRouter);

export default app;
