
let map_token = mapToken;
mapboxgl.accessToken = map_token;

const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker2 = new mapboxgl.Marker({ color: "maroon", rotation: 45 })
  .setLngLat(listing.geometry.coordinates)
   .setPopup(new mapboxgl.Popup({offset:25, className: 'my-class'})
    .setHTML(`<h5>${listing.title}</h5><p>Exact location provided after booking</p>`))
  .addTo(map);
