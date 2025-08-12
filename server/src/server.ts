import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import polygonRoutes from './routes/polygonRoutes';
import serverHealthRoute from './routes/serverHealthRoute';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5006;
const DELAY = 5000;


const customDelayMiddleware = (request: Request, response: Response, next: NextFunction) => {
  if (request.method !== 'GET') setTimeout(() => {
    next();
  }, DELAY);
};

const customLogMiddleware = (request: Request, response: Response, next: NextFunction) => {
   console.log("A new request received at " + Date.now());
   next();
};

const devOrigins = ['http://localhost:5173', 'http://localhost:4173']; //vite
const allowedOrigins = (process.env.NODE_ENV === "production") ? [process.env.ALLOWED_ORIGIN] : devOrigins;



app.use(cors());
app.use(express.json());
app.use('/api/polygons', polygonRoutes);
app.use('/health', serverHealthRoute);
app.use('/', customDelayMiddleware);
app.use('/', customLogMiddleware);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

process.stdin.resume();