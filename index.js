const express = require ('express');
const app = express();
const fetch = require('node-fetch');
const port = process.env.PORT || 8000;
const Datastore = require('nedb');
const database = new Datastore('database.db');
database.loadDatabase();
require('dotenv').config()

app.listen(port, () => console.log(`listening at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.get('/weather/:latlon', async (req, res) => {
    const latlon  = req.params.latlon.split(",");
    const lat = latlon[0];
    const lon = latlon[1];
    const weather_url = `https://api.darksky.net/forecast/${process.env.API_KEY}/${lat},${lon}`
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    //this is a proxy server 
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    //if we want to use the fetch api (client side api) in node, install the node-fetch package 
    const data = {
        weather: weather_data,
        air_quality: aq_data
    };
    res.json(data);
});

app.get("/api", (req, res) => {
    database.find({}, (err, data) => {
        if (err){ response.end(); return; }
        res.json(data);
    })
});

//Put things in the database
app.post('/api', (request, response) => {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp
    database.insert(data);
    response.json(data);
});