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
var cuisineList = [];
var cuisine = [];

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

//Collects user data to filter restaurants
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
                this.cuisineList = [];
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
                var restaurant = new Restaurant;
                if (cuisine[j].name == cuisineChoice) {
                    if (restaurant.name != undefined) {
                        restaurantsList.push(restaurant);
                    }
                } 
            }
        }
    }
    displayNames();
    console.log(restaurantsList);
};

//Creates a modal for displaying each of the Restaurant objects and enters the data from the API
function createModals(i) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
    document.getElementById('name').innerHTML = restaurantsList[i].name;
    var image = document.getElementById('image');
    image.setAttribute("src", `${restaurantsList[i].images}`);
    image.style.height = '300px';
    document.getElementById('rating').innerHTML = restaurantsList[i].rating;
    document.getElementById('address').innerHTML = restaurantsList[i].address;
    var price = document.getElementById('price');
    price.innerHTML = restaurantsList[i].price;
    if (price.innerHTML == 'undefined') {
        price.innerHTML = 'Unavailable';
    }
    var link = document.getElementById('website');
    link.innerHTML = restaurantsList[i].website;
    link.setAttribute("href", `${restaurantsList[i].website}`);
    if (restaurantsList[i].isClosed === true) {
        document.getElementById('is-closed').innerHTML = 'Currently Closed';
    } else {
        document.getElementById('is-closed').innerHTML = 'Currently Open';
    }
    restaurantsList[i].cuisineList = [];
    for (let j = 0; j < restaurantsList[i].cuisine.length; j++) {
        restaurantsList[i].cuisineList.push(restaurantsList[i].cuisine[j].name);
    }
    console.log(restaurantsList[i].cuisineList)
    document.getElementById('cuisine').innerHTML = restaurantsList[i].cuisineList.join(', ');
    document.getElementById('distance').innerHTML = Math.round(restaurantsList[i].distance * 10) / 10 + " km";
    document.getElementById('description').innerHTML = restaurantsList[i].description;
}

//Adds restaurants to your search history
function addToHistory() {
    var pastSearches = document.getElementById('past-searches');
    var past = current.cloneNode(true);
    pastSearches.appendChild(past);
}

//Displays the restaurant names in the 'Suggested' list
function displayNames() {
    var ul = document.getElementById('suggested');
    ul.innerHTML = '';
    for (let i = 0; i < restaurantsList.length; i++) {
        var li = document.createElement('li');
        li.setAttribute("id", `${i}`)
        li.addEventListener('click', function(e) {
            current = e.target;
            current.setAttribute("href", "#modal-init");
            current.setAttribute("class", "modal-trigger");
            createModals(i);
            addToHistory();
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



require([
    "esri/Map",
    "esri/views/MapView",
    "esri/portal/Portal",
    "esri/widgets/BasemapGallery",
    "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
    "esri/widgets/Expand"
  ], function(
    Map,
    MapView,
    Portal,
    BasemapGallery,
    PortalBasemapsSource,
    Expand
  ) {


    const portal = new Portal();

    // source for basemaps from a portal group
    // containing basemaps with different projections
    const source = new PortalBasemapsSource({
      portal,
      query: {
        id: "bdb9d65e0b5c480c8dcc6916e7f4e099"
      }
    });


    const map = new Map({
      basemap: {
        portalItem: {
          id: "8d91bd39e873417ea21673e0fee87604" // nova basemap
        }
      }
    });

    // center the view over 48 states
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [-100, 35],
      zoom: 2,
      constraints: {
        snapToZoom: false
      }
    });
    view.ui.add("srDiv", "top-right");

    const bgExpand = new Expand({
      view,
      content: new BasemapGallery({ source, view }),
      expandIconClass: "esri-icon-basemap"
    });
    view.ui.add(bgExpand, "top-right");

    view.watch("spatialReference", ()=> {
      document.getElementById("srDiv").innerHTML = `view.spatialReference.wkid = <b>${view.spatialReference.wkid}</b>`;
    });
  });

  // everything below this is for the js for the map

  setBoundaries();
