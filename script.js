const weather = {
    apiKey: "a8d5fa8b52643c0dac4c01642903780c",
    fetchWeather: function (city, units = "metric") {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${this.apiKey}`
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data, units));
    },
    fetchWeatherByCoords: function (lat, lon, units = "metric") {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${this.apiKey}`
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data, units));
    },
    displayWeather: function (data, units) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, temp_min, temp_max, humidity, pressure } = data.main;
        const { speed } = data.wind;
        const { sunrise, sunset } = data.sys;
        const { all: cloudiness } = data.clouds;
        const { rain, snow } = data;

        const tempUnit = units === "metric" ? "°C" : "°F";
        const windUnit = units === "metric" ? "m/s" : "mph";

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + tempUnit;
        document.querySelector(".high-low").innerText =
            "High: " + temp_max + tempUnit + " / Low: " + temp_min + tempUnit;
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".pressure").innerText =
            "Pressure: " + pressure + " hPa";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " " + windUnit;
        document.querySelector(".sunrise").innerText =
            "Sunrise: " + new Date(sunrise * 1000).toLocaleTimeString();
        document.querySelector(".sunset").innerText =
            "Sunset: " + new Date(sunset * 1000).toLocaleTimeString();
        document.querySelector(".cloudiness").innerText =
            "Cloudiness: " + cloudiness + "%";
        document.querySelector(".precipitation").innerText =
            "Precipitation: " +
            (rain ? rain["1h"] + " mm/h" : snow ? snow["1h"] + " mm/h" : "0 mm/h");

        document.querySelector(".weather").classList.remove("loading");
    },
    search: function () {
        const units = localStorage.getItem("units") || "metric";
        const city = document.querySelector(".search-bar").value;
        this.fetchWeather(city, units);
    },
    getLocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const units = localStorage.getItem("units") || "metric";
                this.fetchWeatherByCoords(
                    position.coords.latitude,
                    position.coords.longitude,
                    units
                );
                this.updateRadar(position.coords.latitude, position.coords.longitude);
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    },
    updateRadar: function (lat, lon) {
        document.getElementById("radarFrame").src =
            `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=5&level=surface&overlay=rain&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&detailLat=${lat}&detailLon=${lon}&metricWind=default&metricTemp=default&radarRange=-1`;
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Hide search bar if not on Weather tab
    document.getElementById("searchBar").style.display = tabName === "Weather" ? "flex" : "none";

    // Close menu
    toggleMenu();

    // Fetch news if on News tab
    if (tabName === "News") {
        fetchNews();
    }
}

function toggleMenu() {
    var menuContent = document.getElementById("menuContent");
    if (menuContent.style.display === "block") {
        menuContent.style.display = "none";
    } else {
        menuContent.style.display = "block";
    }
}

function saveUnits() {
    const units = document.querySelector(".units").value;
    localStorage.setItem("units", units);
    weather.search();
}

function toggleGeolocation() {
    const geolocationEnabled = document.getElementById("geolocation").checked;
    localStorage.setItem("geolocation", geolocationEnabled);
    if (geolocationEnabled) {
        weather.getLocation();
    }
}

const newsApiKey = "1dd9061ef2784050b2bfc150be994762";
const newsApiUrl = "https://newsapi.org/v2/top-headlines?country=us&apiKey=" + newsApiKey;

async function fetchNews() {
    try {
        const response = await fetch(newsApiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch news.");
        }
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error(error.message);
    }
}

function displayNews(articles) {
    const newsContent = document.getElementById("newsContent");
    newsContent.innerHTML = articles.map(article => `
        <article>
            <h3>${article.title}</h3>
            <p>${article.description}</p>
        </article>
    `).join('');
}

function changeTheme() {
    const theme = document.getElementById("theme").value;
    localStorage.setItem("theme", theme);
    applyTheme(theme);
}

function applyTheme(theme) {
    document.body.classList.remove("light-mode", "dark-mode");
    if (theme === "light") {
        document.body.classList.add("light-mode");
    } else if (theme === "dark") {
        document.body.classList.add("dark-mode");
    }
}

function setNotifications() {
    const notifications = document.getElementById("notifications").value;
    localStorage.setItem("notifications", notifications);
    // Implement notification logic here
}

// Apply the saved settings on load
window.onload = function () {
    const units = localStorage.getItem("units") || "metric";
    document.querySelector(".units").value = units;
    const geolocationEnabled = localStorage.getItem("geolocation") !== "false";
    document.getElementById("geolocation").checked = geolocationEnabled;
    if (geolocationEnabled) {
        weather.getLocation();
    }
    const theme = localStorage.getItem("theme") || "default";
    document.getElementById("theme").value = theme;
    applyTheme(theme);
    const notifications = localStorage.getItem("notifications") || "none";
    document.getElementById("notifications").value = notifications;
};
