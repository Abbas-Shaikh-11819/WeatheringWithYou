const express = require('express');
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
app.use(express.static('public'));

app.get("/api/weather", async (req,res) => {
    const city = req.query.city;
    const apikey = process.env.API_KEY;

    if(!city){
        return res.status(400).json({ error: "City parameter required" });
    }
     if (!apikey) {
    return res.status(500).json({ error: "Server misconfiguration: API_KEY is missing" });
  }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)

        if(!response.ok){
             const errText = await response.text();
      console.error("OpenWeatherMap error:", response.status, errText);
            throw new Error("Error fetching cities");
            
        }
        const data = await response.json()
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get("/", async (req, res) => {
    res.render('home')
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


module.exports = app;