// weather app

// create constants for the html elements we need to access
const weatherform = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
// create a constant to store the unique API Key for https://openweathermap.org/
const apiKey = "1f6210c47b2f9d98ee6f945f65fdf07c";

// Event Listener for the Submit button
weatherform.addEventListener("submit", async event => { // Asynchronous function
    // prevent page from refreshing
    event.preventDefault();

    // Create constant and load the content submitted by the end user
    const city = cityInput.value;

    // If city, try to get the weather data
    if(city) {
        try {
            const weatherData = await getWeatherData(city);     // Call get weather function
            displayWeather(weatherData);                        // Call display weather function
            console.log(weatherData);
        }
        catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else {
        displayError("Please enter a city");
    }

    // Clear the form textbox and reset the focus to the textbox for the next entry
    cityInput.value = "";
    cityInput.focus();


});

// async function to get the weather data from https://openweathermap.org/
async function getWeatherData(city) {

    // Generate the API call and store it in a constant
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Perform the API call
    const response = await fetch(apiUrl);

    if(!response.ok) {
        throw new Error("Could not fetch weather data");
    }

    // return the contents of the json file
    return await response.json();
    
}

function displayWeather(data) {

    // Get the data from the API call and store it in variables
    const {name: city, 
        main: {temp, humidity}, 
        weather: [{description, id}]} = data;

    // Reset the display card to clear any/all old data
    card.textContent = "";
    card.style.display = "flex";

    // Create the html elements that will hold the various aspects of the weather data
    const cityDisp = document.createElement("h1");
    const tempDisp = document.createElement("p");
    const humDisp = document.createElement("p");
    const descDisp = document.createElement("p");
    const emojiDisp = document.createElement("p");

    // Load the weather data into the html elements
    cityDisp.textContent = city;
    tempDisp.textContent = `${((temp - 273.15) * (9/5) + 32).toFixed(1)}°F`;
    humDisp.textContent = `Humidity: ${humidity}%`;
    descDisp.textContent = description;

    // build icon link
    emojiLink = "url('https://openweathermap.org/payload/api/media/file/" + getWeatherEmoji(id) + "d.png')";
    
    emojiDisp.style.backgroundImage = emojiLink;

    // add the class names to the html elements so they display with the correct layout
    cityDisp.classList.add("cityDisp");
    tempDisp.classList.add("tempDisp");
    humDisp.classList.add("humDisp");
    descDisp.classList.add("descDisp");
    emojiDisp.classList.add("emojiDisp");

    // append the newly created html elements to the div.card element
    card.appendChild(cityDisp);
    card.appendChild(tempDisp);
    card.appendChild(humDisp);
    card.appendChild(descDisp);
    card.appendChild(emojiDisp);


}

// Get the weather icon associated with the current weather conditions
function getWeatherEmoji(weatherID) {

    // use a switch case to return the correct icon based on the value of the weather ID
    switch(true) {
        case (weatherID >= 200 && weatherID < 300):
            // thunderstorms
            return "11";
            break;
        case (weatherID >= 300 && weatherID < 400):
            // drizzle
            return "09";
            break;
        case (weatherID >= 500 && weatherID < 600):
            // rain
            return "10')";
            break;
        case (weatherID >= 600 && weatherID < 700):
            // snow
            return "13";
            break;
        case (weatherID >= 700 && weatherID < 800):
            // mist/smoke/haze/fog/etc.
            return "50";
            break;
        case (weatherID == 800):
            // clear skies
            return "01";
            break;
        case (weatherID > 800 && weatherID < 900):
            // clouds
            return "02";
            break;


           
            

    }
}

function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("error");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);

}