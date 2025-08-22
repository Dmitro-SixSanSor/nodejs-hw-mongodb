import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.isValidObjectId(contactId)) {
    return next(createHttpError(404, `${contactId} not valid id`));
  }
  next();
};
