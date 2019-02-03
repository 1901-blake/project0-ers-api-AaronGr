import express from 'express';
import { users } from '../data';
import { User } from '../models/user';
import { UserDao } from '../dao/user-dao';

export const authRouter = express.Router();
const userDao = new UserDao;

 authRouter.post('/login', (req, res) => {
  let user: User;

  userDao.checkUserLogin(req.body.username, req.body.password)
  .then( u => {
     user = u;
     if ( user ) {
      req.session.user = user;
      console.log(req.session.user);
      res.json(user);
     }
     // If user doesn't exist or incorrect password return 400
      res.status(400).json({ message: 'Invalid Credentials'});
  });
});