const api =
  " https://geo.ipify.org/api/v1?apiKey=at_SHQdKRf0kMSjKRA3IDqQ6PVUKQ51h";
const ipAddressEl = document.getElementById("ipAddress");
const locationEl = document.getElementById("location");
const timezoneEl = document.getElementById("timezone");
const ispEl = document.getElementById("isp");
const inputSearch = document.getElementById("searchInput");
var mymap = L.map("map");

function fetchData(option) {
  fetch(`${api}${option}`)
    .then((Response) => Response.json())
    .then((data) => setData(data));
}

fetchData("&domain=www.google.com");

const updateMap = function (lat, long) {
  mymap.setView([lat, long], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG92ZWtlc2hyYW5hOSIsImEiOiJja3J1ZXQ2ZDEzdDN0MnBwZWVlYzV1MGNkIn0.L4KsxLv2TVOEKQpuVlMWVg",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibG92ZWtlc2hyYW5hOSIsImEiOiJja3J1ZXQ2ZDEzdDN0MnBwZWVlYzV1MGNkIn0.L4KsxLv2TVOEKQpuVlMWVg",
    }
  ).addTo(mymap);

  var customIcon = L.icon({
    iconUrl: "../assets/Images/icon-location.svg",
    iconSize: [30, 40], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  L.marker([lat, long],{icon: customIcon}).addTo(mymap);
};

const setData = function (res) {
  ipAddressEl.innerHTML = res.ip;
  locationEl.innerHTML = `${res.location.city},${res.location.country} ${res.location.postalCode}`;
  timezoneEl.innerHTML = `UTC ${res.location.timezone}`;
  ispEl.innerHTML = res.isp;

  let lat = res.location.lat;
  let long = res.location.lng;

  updateMap(lat, long);
};

function getIpInfo() {
  let enteredValue = inputSearch.value;
  let options = "";
  if (enteredValue) {
    if (validateIpAddress(enteredValue)) {
      options = "&ipAddress=" + enteredValue;
    } else if (validateDomain(enteredValue)) {
      options = "&domain=" + enteredValue;
    }
    fetchData(options);
  }
}

function validateIpAddress(ipAddress) {
  if (
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ipAddress
    )
  ) {
    return true;
  }

  return false;
}

function validateDomain(domain) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(domain);
}
