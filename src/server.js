import express from 'express';
import cors from 'cors';
import contactsRouter from './controllers/contactsController.js';
import { errorHandler } from './middlewares/errorHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  // 404
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Error handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};