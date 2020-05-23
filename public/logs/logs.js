    const mymap = L.map('map');
    mymap.setView([0, 0], 1);
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, {attribution});
    tiles.addTo(mymap);
    


async function getData(){
    const response = await fetch('/api');
    const data = await response.json();
    // data.forEach(el => {
    //     const root = document.createElement('p');
    //     const geo = document.createElement('div');

    //     geo.textContent = `latitude: ${el.lat}, longitude: ${el.lng}`;
    
    //     root.append(geo);
    //     document.body.append(root);
    // });
    // console.log(data);

    ////drawing the map
    
   ///marker.setLatLng([latitude,longitude]);
    data.forEach(el => {
        const marker = L.marker([el.lat, el.lng]).addTo(mymap);
        let txt = `
            The weather at ${el.lat}°,${el.lng}° has ${el.weather.weather1.descrition}
            with a Temperature of ${(parseFloat(el.weather.weather2.temp)-273.15).toFixed(2)}°C.
            
        `;

        if(el.air_quality.noair < 0){
            txt += `NO AIR QUALITY READING :(`;
        }else{
        txt += `
        The Concentration of particulate matter (${el.air_quality.parameter})
        is ${el.air_quality.value} ${el.air_quality.unit}.
        ${el.air_quality.lastUpdated}.`;
        }
        marker.bindPopup(txt);
    });
    console.log(data);
}
getData();





