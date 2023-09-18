import bodyParser from 'body-parser';
import express from 'express';
import { users } from './routes/users.mjs';
import morgan from 'morgan';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

// app.use(express.json());
// app.use((req, resp, next) => {
//     req.body.add = 100;
//     next();
// })
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use('/users', users);

const server = app.listen(8080);
server.on('listening', () => console.log(`server is listening on port ${server.address().port}`));
app.use(errorHandler);