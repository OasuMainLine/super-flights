import { Document } from 'mongoose';

export interface IPassenger extends Document {
  _id: string;
  name: string;
  email: string;
}
