const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const sortMiddleware = require('./app/middlewares/sortMiddleware');

const app = express();
const port = 3000;

const route = require('./routes/index.js');
const db = require('./config/db');

// Connect to DB
db.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css', express.static(path.join(__dirname, 'public/css')));

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

app.use(methodOverride('_method'));

// Custom middlewares
app.use(sortMiddleware);

// HTTP logger
app.use(morgan('combined'));

// Template Engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers: require('./helpers/handlebars'),
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Init Routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
