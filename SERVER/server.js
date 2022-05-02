const { application } = require('express');
const { response } = require('express');
const express = require('express')
const app = express()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config()

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Connected! Server starting at port ${PORT}`)
})

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//Use View Engine
app.set('view engine', 'ejs');



app.get("/", (req,res) => {
   res.render('index' , {
       city: null,
       des: null,
       temp: null,
       country: null,
       date: null,
       suffix:null,
       day: null
   })

})

app.post('/', async (req,res) => {
    const zip = req.body.zipcode;
    const url_api= `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${process.env.API_KEY}`;
    const currentDate = new Date();
    

    await fetch(url_api)
        .then(res => res.json())
        .then(data => {
                //Kelvin to F conversion 
                const temp = Math.floor(1.8 * (data.main.temp - 273.15) + 32);
                const des = data.weather[0].main;
                const city = data.name; 
                const country = data.sys.country;
                const date = new Date().toLocaleDateString('default', {month: 'long'});
                const day = currentDate.getDate();
                const suffix = "st";
 

                res.render('index', {
                    temp , des , city , country , date , suffix , day
                });
            
        })       

})  

module.exports = app;

