import express from 'express';
import { User } from '../models/user';
import { users } from '../data';

export const userRouter = express.Router();