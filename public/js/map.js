// Step 52

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // conatainer ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL, can change ( see docs (e.g. for dark = replace streets))
  center: listing.geometry.coordinates, // starting point [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.location}</h4>
      <p>Exact Location provided after booking</p>`
    )
  )
  .addTo(map);
