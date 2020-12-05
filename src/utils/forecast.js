const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = "http://api.weatherstack.com/current?access_key=8084de13b9137fc0a77272d776798647&query=" +latitude +"," +longitude +"&units=f";

    request ({ url, json: true }, (error, { body }) => {
        const cr = body.current;

        if (error) {
            callback("Unable to access location service.", undefined);
        } else if (body.error) {
            callback("Unable to find location. Try another search.", undefined);
        } else {
            callback(undefined, cr.weather_descriptions[0] +". It is currently " +cr.temperature +"F degrees out at. It feels like " +cr.feelslike +"F degrees. Humidity is at " +cr.humidity +"% with a " +cr.precip +"% chance of raining.");
        }

    })
}

module.exports = forecast;