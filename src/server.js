import express from 'express';
import cors from 'cors';
import contactsRouter from './controllers/contactsController.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/contacts', contactsRouter);

  // Error handler
  app.use(errorHandler);
  app.use('*', notFoundHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
