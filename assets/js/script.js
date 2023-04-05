var link = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&limit=30&currency=USD&lunit=km&lang=en_US'
var minLatitude = 'bl_latitide=0';
var maxLatitude = 'tr_latitude=0';
var minLongitude = 'bl_longitude=0';
var maxLongitude = 'tr_longitude=0';
var info = [];
var restaurants = [];

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
        'X-RapidAPI-Key': '44996f06a7msh44753405c1debc3p124047jsnb848e1d46696',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
   }
};

function fetchAPI() {
    fetch(link, options)
        .catch(err => console.error(err));
}

//Sets up a square boundary based on user's current latitude and longitude and adds it to the link
function setBoundaries() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        return '0';
    }
}

//Stores API info in the 'info' variable in order to manipulate
async function storeInfo() {
    info = await fetch(link, options).then(response => response.json())
    for(let i = 0; i < info.data.length; i++) {
        function Restaurant() {
            this.name = info.data[i].name;
            this.rating = info.data[i].rating;
            this.address = info.data[i].address;
            this.priceLevel = info.data[i].price_level;
            this.website = info.data[i].website;
            this.isClosed = info.data[i].is_closed;
            this.cuisine = info.data[i].cuisine;
            this.description = info.data[i].description;
            this.images = info.data[i].photo;
        }
        var user = new Restaurant();
        if(user.name != undefined) {
            restaurants.push(user);
        }
    }
    console.log(restaurants);
};

//Attach to an event listener when the user submits current location. Currently only has a boundary of 2x2 degrees and is not customizable yet. Might use slider to adjust bounds.