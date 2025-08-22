import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import type {CorsOptions} from 'cors';
import polygonRoutes from './routes/polygonRoutes';
import serverHealthRoute from './routes/serverHealthRoute';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;
const DELAY = 500;


const customDelayMiddleware = (request: Request, response: Response, next: NextFunction) => {
  setTimeout(() => {
    next();
  }, DELAY);
};

const devOrigins = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];
const allowedOrigins = (process.env.NODE_ENV === "production") ? [process.env.ALLOWED_ORIGIN] : devOrigins;


const corsOptions: CorsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(express.json());

app.use(cors(corsOptions));

app.use('/api/health', serverHealthRoute);
app.use('/api/polygons', customDelayMiddleware);
app.use('/api/polygons', polygonRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

process.stdin.resume();