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

// To update the user UserID must be present
userRouter.patch('', (req, res) => {
  const user = users.find( ele => ele.userId === req.body.userId);
  if (user) {
    const props: string[] = Object.keys(user);
    props.forEach( prop => {
      if (req.body[prop]) {
        user[prop] = req.body[prop];
      }
    });
  res.send(user);
  }
});