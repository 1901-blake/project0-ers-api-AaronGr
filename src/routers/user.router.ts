import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserDao } from '../dao/user-dao';

export const userRouter = express.Router();
const userDao = new UserDao();

userRouter.get('/test', (req, res) => {
  console.log('This is only a test');
});

userRouter.get('', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
  userDao.getAllUsers().then( userArray => res.json(userArray));
}]);

userRouter.get('/:id',
  [authMiddleware(['admin', 'associate', 'finance-manager']),
  (req, res) => {
    const userID = +req.params.id;
    userDao.getUserByID(userID).then( user => res.json(user));
}]);

// To update the user UserID must be present
userRouter.patch('', [authMiddleware(['admin']), (req, res) => {
  // Retrieve user first
  userDao.getUserByID(req.body.userId).then( user => {
    const props: string[] = Object.keys(user);
    props.forEach( prop => {
      // Only change value of user if one was supplied in request
      if (req.body[prop]) {
        user[prop] = req.body[prop];
      }
    });
    // Call Dao to update the user with new values
    userDao.updateUser(user).then( userForUpdating => {
        res.send(userForUpdating);
    });
  });
}]);

// Testing Jenkins