import express from 'express';
import { User } from '../models/user';
// import { users, reimbursements } from '../data';
import { authMiddleware } from '../middleware/auth.middleware';
import { UserDao } from '../dao/user-dao';

export const userRouter = express.Router();
const userDao = new UserDao();

userRouter.get('', (req, res) => {
  userDao.getAllUsers().then( userArray => res.json(userArray));
});

userRouter.get('/:id', (req, res) => {
  const userID = +req.params.id;
  userDao.getUserByID(userID).then( user => res.json(user));
});

// To update the user UserID must be present
userRouter.patch('', (req, res) => {
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
});

// userRouter.patch('', (req, res) => {
//   const reimbursement = reimbursements.find( ele => ele.reimbursementId === req.body.reimbursementId);
//   if (reimbursement) {
//     const props: string[] = Object.keys(reimbursement);
//     props.forEach( prop => {
//       if (req.body[prop]) {
//         reimbursement[prop] = req.body[prop];
//       }
//     });
//    res.send(reimbursement);
//   }
// });