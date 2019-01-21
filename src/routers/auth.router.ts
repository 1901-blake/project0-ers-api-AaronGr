import express from 'express';
import { users } from '../data';
import { User } from '../models/user';

export const authRouter = express.Router();


authRouter.post('/login', (req, res) => {
  // Check that user exists and store them in variable
  const user: User = users.find( ele => {
    return req.body.username === ele.username;
  });

  // If they exist check password of request matches
  if ( user ) {
    if ( req.body.password === user.password ) {
      req.session.user = user;
      res.json(user);
    }
  }

  // If user doesn't exist or incorrect password return 400
  res.status(400).json({ message: 'Invalid Credentials'});
});