import express from 'express';
import { ReimbursementDao } from '../dao/reimburse-dao';
import { authMiddleware } from '../middleware/auth.middleware';

export const reimburseRouter = express.Router();
const reimbursDao = new ReimbursementDao();

reimburseRouter.get('', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
  reimbursDao.getAllReimbursements().then( reimburseArray => res.json(reimburseArray));
}]);

reimburseRouter.get('/status/:statusId', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
    reimbursDao.getReimbursementsByStatusId(+req.params.statusId)
    .then(reimbursementArray => res.status(200).send(reimbursementArray));
}]);

reimburseRouter.get('/author/userId/:userId', [authMiddleware(['admin', 'finance-manager', 'associate']), (req, res) => {
    reimbursDao.getReimbursementsByUserId(+req.params.userId)
    .then(reimbursementArray => res.status(200).send(reimbursementArray));
  }]);

reimburseRouter.post('', (req, res) => {
    if (req.body.reimbursementId === 0) {
        reimbursDao.submitReimbursement(req.body)
        .then( reimb => res.status(201).send(reimb));
    } else {
         res.sendStatus(400);
    }
  });

// To update the reimbursement reimbursementId must be present
reimburseRouter.patch('', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
    reimbursDao.getReimbursementById(req.body.reimbursementId).then( reimb => {
      const props: string[] = Object.keys(reimb);
      props.forEach( prop => {
        // Only change value of reimbursement if one was supplied in request
        if (req.body[prop]) {
          reimb[prop] = req.body[prop];
        }
      });
      // Call Dao to update the reimbursements with new values
      reimbursDao.updateReimbursement(reimb).then( reimbForUpdating => {
          res.json(reimbForUpdating);
      });
    });
}]);