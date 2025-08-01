import express from 'express';
import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

const router = express.Router();

// GET /contacts
router.get('/', async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({ status: 200, message: 'Successfully found contacts!', data: contacts });
  } catch (err) {
    next(err);
  }
});

// GET /contacts/:id
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${req.params.contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
});

// POST /contacts
router.post('/', async (req, res, next) => {
  try {
    const newContact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /contacts/:id
router.patch('/:contactId', async (req, res, next) => {
  try {
    const updated = await updateContact(req.params.contactId, req.body);
    if (!updated) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /contacts/:id
router.delete('/:contactId', async (req, res, next) => {
  try {
    const result = await deleteContact(req.params.contactId);
    if (!result) throw createError(404, 'Contact not found');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;