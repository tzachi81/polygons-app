import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import polygonRoutes from './routes/polygonRoutes';
import serverHealthRoute from './routes/serverHealthRoute';

const app = express();
const PORT = process.env.PORT || 5005;
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