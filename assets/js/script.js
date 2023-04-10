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
var cuisine = [];
var modalCount = 0;

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

//Stores API info in the 'info' variable in order to manipulate. Pushes each Restaurant object to the 'restaurants' array with data to be used in the modals
async function storeInfo() {
    info = await fetch(link, options).then(response => response.json()).catch(err => console.log(err));
    for (var i = 0; i < info.data.length; i++) {
        class Restaurant {
            constructor() {
                this.name = info.data[i].name;
                this.rating = info.data[i].rating;
                this.address = info.data[i].address;
                this.price = info.data[i].price;
                this.website = info.data[i].website;
                this.isClosed = info.data[i].is_closed;
                this.cuisine = info.data[i].cuisine;
                this.description = info.data[i].description;
                this.images = info.data[i].photo.images.original.url;
                this.distance = info.data[i].distance;
            }
        }
        if (cuisineChoice == cuisineOptions[0]) {
            var restaurant = new Restaurant;
            if (restaurant.name != undefined) {
                restaurantsList.push(restaurant);
            }
        } else if (info.data[i].cuisine != undefined) {
            cuisine = info.data[i].cuisine;
            for (var j = 0; j < cuisine.length; j++) {
                if (cuisine[j].name == cuisineChoice) {
                    var restaurant = new Restaurant;
                    if (restaurant.name != undefined) {
                        restaurantsList.push(restaurant);
                    }
                }
            }
        }
    }
    displayNames();
    console.log(info.data);
};

//Creates a modal for displaying each of the Restaurant objects
function createModals(i) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
    document.getElementById('name').innerHTML = restaurantsList[i].name;
    var a = document.getElementById('image').setAttribute("src", `${restaurantsList[i].images}`);
    console.log(a);
    document.getElementById('rating').innerHTML = restaurantsList[i].rating;
    document.getElementById('address').innerHTML = restaurantsList[i].address;
    document.getElementById('price').innerHTML = restaurantsList[i].price;
    document.getElementById('website').innerHTML = restaurantsList[i].website;
    if (restaurantsList[i].isClosed === true) {
        document.getElementById('is-closed').innerHTML = 'Currently Closed';
    } else {
        document.getElementById('is-closed').innerHTML = 'Currently Open';
    }
    document.getElementById('cuisine').innerHTML = restaurantsList[i].cuisine;
    document.getElementById('distance').innerHTML = Math.round(restaurantsList[i].distance * 10) / 10 + "km";
    document.getElementById('description').innerHTML = restaurantsList[i].description;
}

//Displays the restaurant names in the 'Suggested' list
function displayNames() {
    var ul = document.getElementById('suggested');
    ul.innerHTML = '';
    for (let i = 0; i < restaurantsList.length; i++) {
        var li = document.createElement('li');
        li.setAttribute("id", `${i}`)
        li.addEventListener('click', function(e) {
            var button = e.target;
            button.setAttribute("href", "#modal-init");
            button.setAttribute("class", "modal-trigger");
            createModals(i);
        })
        li.innerHTML = restaurantsList[i].name;
        ul.appendChild(li);
    }
    if (restaurantsList.length === 0) {
        var li = document.createElement('li');
        li.innerHTML = 'ERROR: Could not find any matching restaurants near you';
        ul.appendChild(li);
    }
}

setBoundaries();


