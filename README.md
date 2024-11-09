How It Works
When the app loads, it fetches the list of all countries from the Rest Countries API.
The user can search for a country by typing in the search box. The list of countries will be filtered based on the search query.
If there are more than 10 matching countries, the app will prompt the user to refine their search.
If there is only one country matching the search, the app will display detailed information about that country, including its flag and the weather in its capital.
For the weather information, the app makes a request to OpenWeatherMap, displaying the description and temperature of the capital's weather.
Project Structure
src/App.js: Main component that handles the country data fetching, search, and display logic.
src/App.css: Basic styling for the app.
.env: Contains the OpenWeatherMap API key.
