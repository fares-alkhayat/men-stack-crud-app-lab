// imports
const express = require("express") //importing express package
const app = express() // creates a express application
const dotenv = require("dotenv").config() //this allows me to use my .env values in this file
const mongoose = require("mongoose")
const methodOverride = require('method-override')
const morgan = require('morgan')


const Food = require('./models/food')

// Middleware
app.use(express.static('public')); //all static files are in the public folder
app.use(express.urlencoded({ extended: false })); // this will allow us to see the data being sent in the POST or PUT
app.use(methodOverride('_method'))
app.use(morgan('dev'))


async function conntectToDB(){ //connection to the database
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to Database")
    }
    catch(error){
        console.log("Error Occurred",error)
    }
}



conntectToDB()


// Create route

async function createFood(){
    const newFood = await Food.create({
        name: "Chicken Ramen",
        description: "A hot, steamy bowl of ramen filled which chicken broth, chicken chashu, ajitama eggs, rice cake, seaweed and freshly cooked noodles.",
        price: 4.99,
        category: "Noodle Soup",
        calories: 550,
        suggestStatus: "For Sale",
        rating: 10,
    })
}

// createFood()

// Routes go here

app.get('/', (req,res)=>{
    res.render('home.ejs')
})


// CRUD

// CREATE
app.get('/add-dish',(req,res)=>{
    res.render('add-dish.ejs')
})


app.post('/dishes', async (req,res)=>{
    console.log(req.body)

// This creates a new fruit in the database with the information from the request body
    const createdDish = await Food.create({ 
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        calories: req.body.calories,
        
    })

    res.redirect('/') // Redirect the user to homepage after fruit is created
})


// READ
app.get('/dishes', async (req,res)=>{
    const allDishes = await Food.find()
    console.log(allDishes)
    res.render('dishes.ejs', {Food: allDishes})
})
  

app.get('/dishes/:dishesId', async (req,res)=>{
    const foundDish = await Food.findById(req.params.dishesId) // Gets the one dish by its id
    res.render('dish-details.ejs',{Food: foundDish})
})


app.delete('/dishes/:dishesId', async (req,res)=>{
    await Food.findByIdAndDelete(req.params.dishesId)
    res.redirect('/dishes')
})


app.get('/dishes/:dishesId/edit', async (req,res)=>{
    const foundDish = await Food.findById(req.params.dishId)
    res.render('edit-dish.ejs',{Food: foundDish})
})

app.put('/dishes/:dishesId', async (req,res)=>{

    const updatedDish = await Food.findByIdAndUpdate(req.params.dishesId, req.body)
    
    res.redirect('/dishes')
})
// server.js


app.listen(3000,()=>{
    console.log("Listening on port " + 3000)
}) // Listen on port 3000
