const socket = io();
console.log("hey");

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { longitude, latitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (err) => {
            console.error(err);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}

// Initialize the Leaflet map
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "sheryains coding school"
}).addTo(map);

const markers = {};
let initialLocationSet = false;

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    if (!initialLocationSet) {
        map.setView([latitude, longitude], 16);
        initialLocationSet = true;
    }
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
