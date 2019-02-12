import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { userRouter } from './routers/user.router';
import { authRouter } from './routers/auth.router';
import * as Data from './data';
import { reimburseRouter } from './routers/reimburse.router';

const app = express();

app.use(bodyParser.json());

// Logging
app.use((req, res, next) => {
    console.log(`Request was made with URL: ${req.path}
    and method: ${req.method}`);
    next();
});

const sessionConfig = {
    secret: 'delicious',
    cookie: { secure: false },
    resave: false,
    saveUnitilialized: false
};

app.use(session(sessionConfig));

app.use((req, resp, next) => {
    console.log(req.get('host'));
    resp.header('Access-Control-Allow-Origin', `${req.headers.origin}`);
    resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    resp.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/reimbursements', reimburseRouter);

app.listen(3000);
console.log('ERS application started on port: 3000');