
    

    if ('geolocation' in navigator) {
        
        console.log('geo here');
        navigator.geolocation.getCurrentPosition(async pos => {
            let lat,lng,weather,air_quality,me;
            
                lat = pos.coords.latitude;
                lng = pos.coords.longitude;
                console.log(lat,lng);
                document.getElementById('lat').textContent = lat.toFixed(4);
                document.getElementById('lng').textContent = lng.toFixed(4);
                const api_url = `weather/${lat},${lng}`;
                const response = await fetch(api_url);
                const json = await response.json();
                console.log(json);
                
                weather = {
                    weather1: json.weatherInfo.weather[0], 
                    weather2: json.weatherInfo.main
                }
                document.getElementById('summary').textContent = weather.weather1.description;
                document.getElementById('temperature').textContent =(parseFloat(weather.weather2.temp)-273.15).toFixed(2);

                try{
                    air_quality = json.airqualInfo.results[0].measurements[0];
                    document.getElementById('aq_parameter').textContent = air_quality.parameter;
                    document.getElementById('aq_value').textContent = air_quality.value;
                    document.getElementById('aq_unit').textContent = air_quality.unit;
                    let date = new Date(air_quality.lastUpdated);
                    document.getElementById('aq_date').textContent = date.toLocaleDateString();

                }catch(error){
                    document.getElementById('aq_parameter').textContent = 'NO READING';
                    document.getElementById('aq_value').textContent = 'NO READING';
                    document.getElementById('aq_date').textContent = 'NO READING';
                    air_quality  = {
                        noair: -1
                    };
                    console.log('Air Quality Info Not Available');
                };

               
                
            
                //sending data to sever
                const data = {
                    lat, lng, weather, air_quality
                };
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
                const db_response = await fetch('/api', options);
                const db_json = await db_response.json();
                console.log(db_json);
            
        });
    } else {
        console.log('geo not');
    }

    
