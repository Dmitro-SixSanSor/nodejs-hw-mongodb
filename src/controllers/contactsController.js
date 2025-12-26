import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

// GET /contacts
export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// GET /contacts/:id
export const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);
  if (!contact) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
};

// POST /contacts
export const createContactController = async (req, res, next) => {
  const newContact = await createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

// PATCH /contacts/:id
export const updateContactController = async (req, res, next) => {
  const updated = await updateContact(req.params.contactId, req.body);
  if (!updated) throw createError(404, 'Contact not found');

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

// DELETE /contacts/:id
export const deleteContactController = async (req, res, next) => {
  const result = await deleteContact(req.params.contactId);
  if (!result) throw createError(404, 'Contact not found');

  res.status(204).send();
};
