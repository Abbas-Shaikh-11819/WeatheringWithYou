const express = require('express');
const path = require("path");

const app = express();
const PORT = 3003;

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

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)

        if(!response.ok){
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

module.exports = app;