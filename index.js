require('dotenv').config()
const express = require('express');
const DatatStore = require('nedb');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`listening on port ${port}`));
app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));

const database = new DatatStore('database.db');
database.loadDatabase();

app.get('/api',(request,response) =>{
    database.find({},(err, data) =>{
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
});

app.post('/api',(request,response)=>{
    console.log('had a request!');
    const data = request.body;
    //console.log(data);
    database.insert(data);
    response.json(data);
});

app.get('/weather/:latlon',async (request,response)=>{
    const latlon = request.params.latlon.split(',');
    let lat,lng;
    lat = latlon[0];
    lng = latlon[1];
    console.log(lat,lng);

    //open map api request 
    const api_key = process.env.API_KEY;
    const ow_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${api_key}`;
    const ow_response = await fetch(ow_url);
    const ow_json = await ow_response.json();
   
    
    //Air Quality api request
    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lng}`;
    const aq_response = await fetch(aq_url);
    const aq_json = await aq_response.json();

    const data = {
        weatherInfo: ow_json,
        airqualInfo: aq_json
    };
    response.json(data);
});
