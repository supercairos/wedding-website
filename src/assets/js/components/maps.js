import { Loader } from '@googlemaps/js-api-loader';

const setupChurchMap = (google) => {
    const boatLatLng = new google.maps.LatLng(48.858139, 2.336178);
    const boatMap = new google.maps.Map(document.getElementById("church-map"), {
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

const setupBoatMap = (google) => {
    const boatLatLng = new google.maps.LatLng(48.858139, 2.336178);
    const boatMap = new google.maps.Map(document.getElementById("boat-map"), {
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

const setupBrunchMap = (google) => {
    const boatLatLng = new google.maps.LatLng(48.858139, 2.336178);
    const boatMap = new google.maps.Map(document.getElementById("brunch-map"), {
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
        setupChurchMap(google);
        setupBoatMap(google);
        setupBrunchMap(google);
    })
    .catch(e => {
        // do something
    });