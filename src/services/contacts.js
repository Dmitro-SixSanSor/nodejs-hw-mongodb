import { Contact } from '../models/contactModel.js';

export const getAllContacts = () => {
  return Contact.find();
};

export const getContactById = async (id) => {
  return await Contact.findById(id);
};