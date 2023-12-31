"use-strict";

const ip_input = document.querySelector(".IP-adress-input");
const btn = document.querySelector(".submit-btn");
const ip_output = document.querySelector(".IP-adress");
const location_output = document.querySelector(".location");
const timezone_output = document.querySelector(".timezone");
const isp_output = document.querySelector(".ISP");

let myIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [55, 65],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const init = function () {
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(loadMap.bind(this), function () {
      alert("Location not Permitted");
    });

  getClientIP();
};

const getClientIP = async function () {
  const ip = await fetch("https://api.ipify.org?format=json");
  const ipJson = await ip.json();
  const resIp = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=at_fpPtKzdeBNmviTWhg3aJwipTYZ7vR&ipAddress=${ipJson.ip}`
  );
  const resIpJson = await resIp.json();
  outputData(resIpJson);
};

const loadMap = function (position) {
  console.log(position);
  const { latitude } = position.coords;
  const { longitude } = position.coords;

  const coords = [latitude, longitude];
  let map = L.map("map", {
    preferCanvas: true,
  }).setView(coords, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  let marker = L.marker(coords, { icon: myIcon }).addTo(map);
};

init();

const outputData = function (data) {
  ip_output.textContent = data.ip;
  location_output.textContent = data.location.region;
  timezone_output.textContent = `UTC ${data.location.timezone}`;
  isp_output.textContent = data.isp;
};

const getCountrybyIP = async function () {
  const ip = ip_input.value;
  if (!ip) return;
  const resIp = await fetch(
    `https://geo.ipify.org/api/v2/country?apiKey=at_fpPtKzdeBNmviTWhg3aJwipTYZ7vR&ipAddress=${ip}`
  );
  const resIpJson = await resIp.json();
  console.log(resIpJson);

  getLatLng(resIpJson.location.country);
  outputData(resIpJson);
};

const getLatLng = async function (country) {
  const resCountry = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  );
  const resCountryJson = await resCountry.json();
  let map = L.map("map", {
    preferCanvas: true,
  }).setView(resCountryJson[0].latlng, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  let marker = L.marker(resCountryJson[0].latlng, { icon: myIcon }).addTo(map);
};

btn.addEventListener("click", getCountrybyIP);
