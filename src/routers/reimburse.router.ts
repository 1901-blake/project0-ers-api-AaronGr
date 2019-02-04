import express from 'express';
import { ReimbursementDao } from '../dao/reimburse-dao';
import { authMiddleware } from '../middleware/auth.middleware';

export const reimburseRouter = express.Router();
const reimbursmentDao = new ReimbursementDao();

reimburseRouter.get('/status/:statusId', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
    reimbursmentDao.getReimbursementsByStatusId(+req.params.statusId)
    .then(reimbursementArray => res.status(200).send(reimbursementArray));
}]);

reimburseRouter.get('/author/userId/:userId', [authMiddleware(['admin', 'finance-manager', 'associate']), (req, res) => {
    reimbursmentDao.getReimbursementsByUserId(+req.params.userId)
    .then(reimbursementArray => res.status(200).send(reimbursementArray));
  }]);

reimburseRouter.post('', (req, res) => {
    if (req.body.reimbursementId === 0) {
        reimbursmentDao.submitReimbursement(req.body)
        .then( reimb => res.status(201).send(reimb));
    } else {
         res.sendStatus(400);
    }
  });

// To update the reimbursement reimbursementId must be present
reimburseRouter.patch('', [authMiddleware(['admin', 'finance-manager']), (req, res) => {
    reimbursmentDao.getReimbursementById(req.body.reimbursementId).then( reimb => {
      const props: string[] = Object.keys(reimb);
      props.forEach( prop => {
        // Only change value of reimbursement if one was supplied in request
        if (req.body[prop]) {
          reimb[prop] = req.body[prop];
        }
      });
      // Call Dao to update the reimbursements with new values
      reimbursmentDao.updateReimbursement(reimb).then( reimbForUpdating => {
          res.json(reimbForUpdating);
      });
    });
}]);