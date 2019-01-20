import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

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

app.listen(3100);
console.log('ERS application started on port: 3100');