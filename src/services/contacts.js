import { Contact } from '../models/contactModel.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const filter = { userId };

  const totalItems = await Contact.countDocuments(filter);
  const data = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage) || 1;

  return {
    data,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = (id, userId) =>
  Contact.findOne({ _id: id, userId });

export const createContact = (data, userId) =>
  Contact.create({ ...data, userId });

export const updateContact = (id, data, userId) =>
  Contact.findOneAndUpdate({ _id: id, userId }, data, { new: true });

export const deleteContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });
