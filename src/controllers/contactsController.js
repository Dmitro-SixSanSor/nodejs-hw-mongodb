import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

// GET /contacts (pagination + sorting)
export const getAllContactsController = async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
  } = req.query;

  const userId = req.user._id;
  const { data, totalItems, totalPages, hasPreviousPage, hasNextPage } =
    await getAllContacts({
      page: parseInt(page),
      perPage: parseInt(perPage),
      sortBy,
      sortOrder,
      userId,
    });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

// GET /contacts/:id
export const getContactByIdController = async (req, res, next) => {
  const userId = req.user._id;
  const contact = await getContactById(req.params.contactId, userId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  const userId = req.user._id;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const newContact = await createContact(
    { ...req.body, photo: photoUrl },
    userId,
  );
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:id
export const updateContactController = async (req, res, next) => {
  const userId = req.user._id;
  const updated = await updateContact(req.params.contactId, req.body, userId);
  if (!updated) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

// DELETE /contacts/:id
export const deleteContactController = async (req, res, next) => {
  const userId = req.user._id;
  const result = await deleteContact(req.params.contactId, userId);
  if (!result) throw createError(404, 'Contact not found');

  res.status(204).send();
};
