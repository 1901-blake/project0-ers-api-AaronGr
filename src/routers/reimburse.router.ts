import express from 'express';
import * as Data from '../data';
import { STATUS_CODES } from 'http';

export const reimburseRouter = express.Router();

reimburseRouter.get('/status/:statusId', (req, res) => {
  const reimbursements = Data.reimbursements.filter( ele => {
      return ele.status === +req.params.statusId;
  });

  if (reimbursements) {
      res.status(200).send(reimbursements);
  }

  res.sendStatus(400);
});

reimburseRouter.get('/author/userId/:userId', (req, res) => {
    const reimbursements = Data.reimbursements.filter( ele => {
        return ele.author === +req.params.userId;
    });

    if (reimbursements) {
        res.status(200).send(reimbursements);
    }
    res.sendStatus(400);
  });

  reimburseRouter.post('', (req, res) => {
    if (req.body.reimbursementId === 0) {
        Data.reimbursements.push(req.body);
        res.status(201).send(req.body);
    }
  });