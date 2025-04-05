// Initialize Kakao map
const container = document.getElementById("map");
const options = {
  center: new kakao.maps.LatLng(37.5326, 126.9906), // Map center: Yongsan, Seoul
  level: 7,
};
const map = new kakao.maps.Map(container, options);

// Add zoom control
const zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// Address to coordinate service
const geocoder = new kakao.maps.services.Geocoder();

// Marker and infowindow storage
let markerArray = [];
let infowindowArray = [];

// Fetch data from API
async function getDataSet(category = "") {
  try {
    const response = await axios.get(`http://localhost:3000/restaurants?category=${category}`);
    return response.data.result;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}

// Get coordinates by address
function getCoordsByAddress(address) {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        resolve(coords);
      } else {
        reject(new Error("Geocoding failed: " + address));
      }
    });
  });
}

// Create infowindow content
function getContent(data) {
  const videoId = data.videoUrl
    .replace("https://youtu.be/", "")
    .replace("https://www.youtube.com/embed/", "")
    .replace("https://www.youtube.com/watch?v=", "")
    .split("&")[0];

  return `
    <div class="infowindow">
      <div class="infowindow-img-container">
        <img src="https://img.youtube.com/vi/${videoId}/mqdefault.jpg" class="infowindow-img" />
      </div>
      <div class="infowindow-body">
        <h5 class="infowindow-title">${data.title}</h5>
        <p class="infowindow-address">${data.address}</p>
        <a href="${data.videoUrl}" class="infowindow-btn" target="_blank">Click to Watch</a>
      </div>
    </div>
  `;
}

// Display markers and infowindows
async function setMap(dataSet) {
  closeAllMarkers();
  closeAllInfowindows();

  for (const data of dataSet) {
    try {
      const coords = await getCoordsByAddress(data.address);

      const marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });
      markerArray.push(marker);

      const infowindow = new kakao.maps.InfoWindow({
        content: getContent(data),
      });
      infowindowArray.push(infowindow);

      kakao.maps.event.addListener(marker, "click", () => {
        closeAllInfowindows();
        infowindow.open(map, marker);
        map.panTo(coords); // Move map center to marker
      });
    } catch (error) {
      console.error("Failed to create marker:", data.title, error);
    }
  }

  kakao.maps.event.addListener(map, "click", closeAllInfowindows);
}

// Close all infowindows
function closeAllInfowindows() {
  infowindowArray.forEach((infowindow) => infowindow.close());
}

// Remove all markers from map
function closeAllMarkers() {
  markerArray.forEach((marker) => marker.setMap(null));
  markerArray = [];
}

// Category filter mapping
const categoryMap = {
  Korean: "한식",
  Chinese: "중식",
  Japanese: "일식",
  Western: "양식",
  Snacks: "분식",
  Grill: "구이",
  Sushi: "회/초밥",
  Others: "기타",
};

// Category button click event
document.querySelector(".category-list").addEventListener("click", async (event) => {
  const categoryId = event.target.id;
  const category = categoryMap[categoryId];
  if (!category) return;

  try {
    const filteredData = await getDataSet(category);
    setMap(filteredData);
  } catch (err) {
    console.error("Category filter failed:", err);
  }
});

// Initialize map with all data
(async function init() {
  const dataSet = await getDataSet();
  setMap(dataSet);
})();
