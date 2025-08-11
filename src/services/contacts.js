import { Contact } from '../models/contactModel.js';

export const getAllContacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;

  const totalItems = await Contact.countDocuments();
  const data = await Contact.find()
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = (id) => Contact.findById(id);

export const createContact = (data) => Contact.create(data);

export const updateContact = (id, data) =>
  Contact.findByIdAndUpdate(id, data, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
