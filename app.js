import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routes from './server/routes/routes';
import mongoose from 'mongoose';
import User from './server/models/user';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


/****
 *
 * Connecting to mongoDB
 *
 * ****/

mongoose.connect('mongodb://localhost:27017/social-cops');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    mongoose.model('User', User);
});


const app = express();

// swagger definition
const swaggerDefinition = {
    info: {
        title: 'SocialCops Swagger API',
        version: '1.0.0',
        description: 'All API endpoints for SocialCops',
    },
    host: 'localhost:3000',
    basePath: '/',
};

// options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./server/routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/****
 *
 * Adding basic middlewares
 *
 * ****/

app.use(bodyParser());
app.use(cookieParser());
app.use('/', routes);

/****
 *
 * Adding Swagger UI for all routes
 *
 * */

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/****
 *
 * Initializing server
 *
 * ****/

app.listen(3000, () => {
    console.log('SocialCops is listening on port 3000!')
});
