const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

var jsonParser = bodyParser.json();
app.use(jsonParser);

app.use(express.static(path.join(__dirname, 'client', 'build')));

// stole from SO https://stackoverflow.com/questions/55254354/access-to-xmlhttprequest-at-http-localhost3000-from-origin-http-192-168
app.options('/*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST');
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Content-Length, X-Requested-With',
	);
	res.sendStatus(200);
});

app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
// end stolen code :o

app.post(
	'/api/weather',
	[body('latitude').notEmpty(), body('longitude').notEmpty()],
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		var options = {
			method: 'GET',
			url: 'https://weatherbit-v1-mashape.p.rapidapi.com/forecast/daily',
			qs: {
				lang: 'en',
				lat: req.body.latitude,
				lon: req.body.longitude,
			},
			headers: {
				'Access-Control-Allow-Origin': '*',
				'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com',
				'x-rapidapi-key': process.env.WEATHER_API_KEY,
				useQueryString: true,
			},
		};

		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			res.send(body);
		});
	},
);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
