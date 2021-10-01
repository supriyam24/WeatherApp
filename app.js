const express = require("express");
const https = require("https");
const bodyParser =  require("body-parser");
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({extended: true})); //Code for using BodyParser package

app.get("/",function(req, res){
                                //              --> GET(REQUEST) -->
                                //clientServer                        ourServer
                                //               <-- RESPONSE <--
  res.sendFile(__dirname + "/index.html");
}); 

app.post("/",function(req,res){  //Catching the POST request for the Root Route "/" from the *FORM* in the index.html
  
  const query = req.body.cityName;  //getting the cityName from the request(from FORM) using bodyParser
  const unit = "metric";
  const apiKey = process.env.API_KEY;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    unit +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    console.log(response.statusCode); //if O/P 200 All A OK!

    response.on("data", function (d) {
      //d is the data that OpenWeather map is actually sending us

      // console.log(d); here you get the the Data in Hexadecimal
      const weatherData = JSON.parse(d); //This will turn the JSON in some String format(text/hexadecimal/binary)
      // and turn it into AN ACTUAL JAVASCRIPT OBJECT.
      //THE OPPOSITE OF DOING JSON.parse(data) IS JSON.stringify(data) --> which converts the javaScript OBJ into String(JSON flatpack)
      //console.log(d);
      //console.log(weatherData); 
      const temp = weatherData.main.temp; //trying to access the temprature from the OBJ by mapping through the OBJ
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.write(
        "<p style='background-color:powderblue ;'>The weather is currently " +
          description +
          "</p>"
      );
      res.write(
        "<h1 style='color:#373A40';>The temperature in " +
          query +
          " is " +
          temp +
          " degrees Celsius</h1>"
      );
      res.write("<img src=" + imgUrl + " >");

      res.send();
    });
  });

})


app.listen(3000, function(){
    console.log("Server running at port 3000");
});