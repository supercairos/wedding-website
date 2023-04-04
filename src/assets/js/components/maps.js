import { Loader } from '@googlemaps/js-api-loader';

const setupDiningMap = (google) => {
    const boatLatLng = new google.maps.LatLng(48.858139, 2.336178);
    const boatMap = new google.maps.Map(document.getElementById("map"), {
        center: boatLatLng,
        mapTypeId: "satellite",
        zoom: 17,
        stylers: [
            { visibility: "off" }
        ]
    });
    new google.maps.Marker({
        position: boatLatLng,
        map: boatMap,
        title: "Hello World!",
    });
};

new Loader({
    apiKey: "AIzaSyDUNo9sr0gOfJ5ZY14lMx91JJM89RVLcdo",
    version: "weekly",
    libraries: ["places"]
}).load()
    .then((google) => {
        setupDiningMap(google);
    })
    .catch(e => {
        // do something
    });