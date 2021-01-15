// grabbing current date
var date = new Date();
// global variable
var listItem;
// for future use to store the value of the user input
var city = "";
//  api key
const apiKey = "&appid=14e9e1a914fcb5a2c472c5cfe5bd32eb";


// search btn
$("#searchBtn").on("click", function() {
    // header is invisible at first and this makes it visible when user clicks btn
  $('#fivedayforecastHeader').removeClass("invisible").addClass("visible");;

  // get the value of the input from user
  city = $("#userSearch").val();
  
  // clear input box
  $("#userSearch").val("");  

  // url to call api
  const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

  $.ajax({
    url: queryUrl,
    method: "GET"
  }).then(function (response){ //response is the information the API gave you

    // calling these functions when the response returns
    getCurrentConditions(response);
    getfivedayForecast(response);
    makeList();

    })
  });
  // list of search history 
  function makeList() {
    listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
  }
  // removes search history 
  $("#clear-history").on("click", function(){
    $(".list-group-item").remove();
    })

  function getCurrentConditions (response) {

    // get the temperature and convert to fahrenheit 
    var convertedTemp = (response.main.temp - 273.15) * 1.80 + 32;
    convertedTemp = Math.floor(convertedTemp);

    $('#currentCity').empty();

    // get and set the contents
    const currentcityCard = $("<div>").addClass("card");
    const cardBody = $("<div>").addClass("card-body");
    const cityName = $("<h2>").addClass("card-title").text(response.name);
    const cityDate = $("<h5>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")
    const temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + convertedTemp + " °F");
    const humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    const windspeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");

    // add to the page
    cityName.append(cityDate, image)
    cardBody.append(cityName, temperature, humidity, windspeed);
    currentcityCard.append(cardBody);
    $("#currentCity").append(currentcityCard)
   
  }

function getfivedayForecast () {
  
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
    method: "GET"
  }).then(function (response){
    $('#forecast').empty();

    var results = response.list;

    for (var i = 0; i < results.length; i++) {

      if(results[i].dt_txt.indexOf("12:00:00") !== -1){
        // grabs the month within dt_txt
        var month = results[i].dt_txt.split('-')[1].split(' ')[0];
        // grabs the day within dt_txt
        var day = results[i].dt_txt.split('-')[2].split(' ')[0];
        // grabs the year within dt_txt
        var year = results[i].dt_txt.split('-')[0].split(' ')[0];
        
        // get the temperature and convert to fahrenheit 
        var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
        var convertedTemp = Math.floor(temp);

        const currentforecastCard = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
        const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
        const cityDate = $("<h5>").addClass("card-title").text(month + "/" + day + "/" + year);
        const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + convertedTemp + " °F");
        const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
        const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

        cardBody.append(cityDate, image, temperature, humidity);
        currentforecastCard.append(cardBody);
        $("#forecast").append(currentforecastCard);
      }
    }
  });

}

