var link = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&limit=30&currency=USD&lunit=km&lang=en_US'
var minLatitude = 'bl_latitide=0';
var maxLatitude = 'tr_latitude=0';
var minLongitude = 'bl_longitude=0';
var maxLongitude = 'tr_longitude=0';
var info = [];

//Fetch Travel Advisor API. If the key isn't working you might have to replace it with a new one
function setPosition(position) {
    minLatitude = `bl_latitude=${position.coords.latitude - 1}`;
    maxLatitude = `tr_latitude=${position.coords.latitude + 1}`;
    minLongitude = `bl_longitude=${position.coords.longitude - 1}`;
    maxLongitude = `tr_longitude=${position.coords.longitude + 1}`;
    link = `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?${minLatitude}&${maxLatitude}&${minLongitude}&${maxLongitude}&limit=30&currency=USD&lunit=km&lang=en_US`
    storeInfo();
}

setBoundaries();

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '00451271c5msh859a5b59f2aef48p18bfdbjsne1104a5da14d',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
   }
};

fetch(link, options)
    .catch(err => console.error(err));
///////////////////////////////////////////////////////////////

//Sets up a square boundary based on user's current latitude and longitude and adds it to the link
function setBoundaries() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        return '0';
    }
}
//////////////////////////////////////////////////////////////////////////

//Stores API info in the 'info' variable in order to manipulate
async function storeInfo() {
    info = await fetch(link, options).then(response => response.json());
    console.log(info);
    //Will need constructor in order to create an object for each restaurant with the relevant info
}
///////////////////////////////////////////////////////////////

//Attach to an event listener when the user submits current location. Currently only has a boundary of 2x2 degrees and is not customizable yet. Might use slider to adjust bounds.
