var link = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=11.847676&tr_latitude=12.838442&bl_longitude=109.095887&tr_longitude=109.149359&limit=30&currency=USD&lunit=km&lang=en_US'
var minLatitude = 'bl_latitide=0';
var maxLatitude = 'tr_latitude=0';
var minLongitude = 'bl_longitude=0';
var maxLongitude = 'tr_longitude=0';
var info = [];
var restaurantsList = [];
var zipcode = 0;
var cuisineOptions = ['Anything', 'Asian', 'American', 'Italian', 'Mexican']
var cuisineChoice = cuisineOptions[0];
var lastSearch = 0;

let map;



//Creates the map
async function initMap() {
    //@ts-ignore
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}
//initMap();

//Adds an event listener to the button so that it can collect user input and use it to customize the fetch request
var submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', submitInput);

function submitInput() {
    restaurantsList = [];
    zipcode = document.getElementById('input_text').value;
    var value = document.getElementById('test').value;
    cuisineChoice = cuisineOptions[value];
    storeInfo();
}

//Sets up a square boundary based on user's current latitude and longitude and adds it to the link
function setBoundaries() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPositionCurrent);
    } else {
        return '0';
    }
}

//Converts zipcode to longitude and latitude and changes the fetch link
function setPositionZipCode() {
     
}

//Sets long/lat to current position and changes the fetch link
function setPositionCurrent(position) {
    minLatitude = `bl_latitude=${position.coords.latitude - 1}`;
    maxLatitude = `tr_latitude=${position.coords.latitude + 1}`;
    minLongitude = `bl_longitude=${position.coords.longitude - 1}`;
    maxLongitude = `tr_longitude=${position.coords.longitude + 1}`;
    link = `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?${minLatitude}&${maxLatitude}&${minLongitude}&${maxLongitude}&limit=30&currency=USD&lunit=km&lang=en_US`
}

//Fetch Travel Advisor API. If the key isn't working you might have to replace it with a new one
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '14d736a9c0msh4f4b723e2123446p1046fcjsnfe7ad3e482fc',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
   }
};

function fetchAPI() {
    fetch(link, options)
        .then(response => response.json())
        .catch(err => console.error(err));
}

//Stores API info in the 'info' variable in order to manipulate. Pushes each Restaurant object to the 'restaurants' array with data to be used in the modals
async function storeInfo() {
    info = await fetch(link, options).then(response => response.json())
    for(var i = 0; i < info.data.length; i++) {
        if(info.data[i].cuisine != undefined) {
            var cuisine = info.data[i].cuisine;
            var results = document.getElementById('sugggested');
            for (var j = 0; j < cuisine.length; j++) {
                if (cuisine[j].name == cuisineChoice || 'Anything' == cuisineChoice) {
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
                        this.distance = info.data[i].distance;
                        this.cuisine = info.data[i].cuisine;
                    }
                    var restaurant = new Restaurant();
                    if (restaurant.name != undefined) {
                        restaurantsList.push(restaurant);
                    }
                }
            }
        }
    }
    displayNames();
    lastSearch = restaurantsList.length;
};

//Displays the restaurant names in the 'Suggested' list
function displayNames() {
    var ul = document.getElementById('suggested');
    ul.innerHTML = '';
    for (let i = 0; i < restaurantsList.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = restaurantsList[i].name;
        ul.appendChild(li);
    }
}

//Creates a modal for displaying each of the Restaurant objects
function createModals() {
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
    });
}

setBoundaries();


