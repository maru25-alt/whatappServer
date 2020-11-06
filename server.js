import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan'

dotenv.config()

//paths
import usersRouter from './routes/users.js'
import messages from './routes/messages.js'
import groups from './routes/groups.js';


//app config
const app = express();
const port = process.env.PORT || 8080

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());
app.use(morgan('dev'));

//api routes
app.get('/', (req, res) => {
    res.status(200).send("Welcome to my app!")
})
app.use('/users', usersRouter);
app.use('/messages', messages);
app.use('/groups', groups);

app.use((req, res , next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
})
app.use((error , req, res , next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


//listen
app.listen(port, () => {
    return console.log(`listening on port ${port}`)
})