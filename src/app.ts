/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';

const app: Application = express();

// parser middleware
app.use(express.json());
app.use(
  cors({
    origin: 'https://sales-management-client-lake.vercel.app', // Update with the actual origin of your frontend
    credentials: true,
  }),
);

app.use(cookieParser());

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Shoe Sales Management');
});

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/a', test);
// not found middleware with http-status

app.use(notFound);

// global err handler middleware. must declare it in the last off the file
app.use(globalErrorHandler);

export default app;
