import React, { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment';

function App() {
	const [weatherData, setweatherData] = useState();
	const [loaded, setloaded] = useState(false);

	const fetchWeather = (latitude, longitude) => {
		fetch('http://localhost:5000/api/weather', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ latitude, longitude }),
		})
			.then((resp) => resp.json())
			.then((resp) => {
				setweatherData(resp);
				setloaded(true);
			});
	};

	const loadData = async () => {
		await navigator.geolocation.getCurrentPosition((location) => {
			console.log(location);
			fetchWeather(location.coords.latitude, location.coords.longitude);
		});
	};

	useEffect(() => {
		loadData();
	}, []);

	const WeatherBoard = ({ city }) => (
		<div className='weather-board'>
			<h1>Weather for {city}</h1>
			<div className='weather-calendar'>
				{weatherData.data.map((data) => {
					return (
						<div className='weather-single-day'>
							<h3>
								{moment(data.datetime).format('dddd, MMM Do')}
							</h3>
							<img
								className='weather-icon'
								src={`https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`}
								alt=''
							/>
							<h5>{data.weather.description}</h5>
							<p>Low: {data.low_temp}</p>
							<p>High: {data.high_temp}</p>
						</div>
					);
				})}
			</div>
		</div>
	);

	return !loaded ? (
		<h5 className='loading'>Loading...</h5>
	) : (
		<WeatherBoard city={weatherData.city_name} />
	);
}

export default App;
