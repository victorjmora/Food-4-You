var link = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?bl_latitude=38.961178&tr_latitude=40.961178&bl_longitude=-81.998795&tr_longitude=-83.998795&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&limit=30&currency=USD&open_now=false&lunit=km&lang=en_US'
var minLatitude = 'bl_latitide=0';
var maxLatitude = 'tr_latitude=0';
var minLongitude = 'bl_longitude=0';
var maxLongitude = 'tr_longitude=0';
var info = [];

//Fetch Travel Advisor API. If the key isn't working you might have to replace it with a new one
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'a4cfa7f01amshdeb32e9825e2762p117943jsn415fa2499866',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
   }
};

fetch(link, options)
    .then(response => response.json())
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

function setPosition(position) {
    minLatitude = `bl_latitude=${position.coords.latitude - 1}`;
    maxLatitude = `tr_latitude=${position.coords.latitude + 1}`;
    minLongitude = `bl_longitude=${position.coords.longitude - 1}`;
    maxLongitude = `tr_longitude=${max2 = position.coords.longitude + 1}`;
    console.log(minLatitude, maxLatitude, minLongitude, maxLongitude);
}

function fetchLink() {
    link = `https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary?${minLatitude}&${maxLatitude}&${minLongitude}&${maxLongitude}&restaurant_tagcategory_standalone=10591&restaurant_tagcategory=10591&limit=30&currency=USD&open_now=false&lunit=km&lang=en_US`
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
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });

setBoundaries();
storeInfo();
