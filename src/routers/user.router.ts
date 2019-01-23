import express from 'express';
import { User } from '../models/user';
import { users } from '../data';
import { authMiddleware } from '../middleware/auth.middleware';

export const userRouter = express.Router();

userRouter.get('', (req, res) => {
  res.json(users);
});

userRouter.get('/:id', (req, res) => {
  const userID = +req.params.id;
  const user = users.find( ele => ele.userId === userID);
  res.json(user);
});

userRouter.patch('', (req, res) => {
});