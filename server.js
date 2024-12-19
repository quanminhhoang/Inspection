const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//Route
const Routes = require('./routes/index.route.js');

//Environment Variable .env file
dotenv.config();
const app = express();

//Database
const db = require('./models/index.model.js');
db.sequelize.sync();

//Port
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', Routes);

app.listen(port, () => {
	console.log(`Application running at http://localhost:${process.env.PORT}/`);
});
