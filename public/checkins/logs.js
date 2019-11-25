const mymap = L.map('checkInMap').setView([0, 0], 1);            
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileURL, { attribution });
tiles.addTo(mymap);

getData();
//log what's in the database
async function getData(){
    const response = await fetch("/api");
    const data = await response.json();

    for (item of data){
        const marker = L.marker([item.lat, item.lon]).addTo(mymap);
        let txt = `Happening now: I'm currently sitting at ${item.lat}&deg
        ${item.lon}&deg on this ${item.weather.summary} day and the temperature is
        a wonderful ${item.weather.temperature} degrees F.`
       
        if (item.air.value < 0){
            txt += " No air quality reading.";
        } else {
            //if air quality has a value > 0, display info for it
            txt += ` The concentration of particular matter (${item.air.parameter}) is ${item.air.value}
            ${item.air.unit} on ${item.air.lastUpdated}`
        }
        marker.bindPopup(txt);
    }
    console.log(data);
}
