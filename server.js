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
app.post('/dishes',async (req,res)=>{
    req.body.suggestStatus = req.body.suggestStatus == "Under Review"
    console.log(req.body)

    const foodCreated = await Food.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        Calories: req.body.calories,
        suggestStatus: "Under Review"
    })
    
    res.redirect('/dishes')

})

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
app.get('/',(req,res)=>{
    res.render('home.ejs')
})

app.get('/dishes',async (req,res)=>{
    const dishes = await Food.find()
    res.render('dishes.ejs',{dishes: dishes})
})

app.get('/dishes/:dishesId', async (req,res)=>{
    console.log(req.params.dishesId)
    const foundDish = await Food.findById(req.params.dishesId)
    console.log(foundDish)
    res.render('dish-details.ejs', {dishes: foundDish})
})

app.get('/add-dish',(req,res)=>{
    res.render('add-dish.ejs')
})

app.put('/dishes/:dishesId', async (req,res)=>{
    const updatedDish = await dishes.findByIdAndUpdate(req.params.dishesId, req.body)})

app.delete('/dishes/:dishesId', async (req,res)=>{
    console.log('Delete dish')
    const deleteDish = await dishes.findByIdAndDelete(req.params.dishesId)
    res.redirect('/dishes')
})

app.post('/dishes/add-dish', async (req,res)=>{
    console.log(req.body)

    const createdFood = await Food.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        calories: req.body.calories,
        suggestStatus: "Under Review"
    })

    res.redirect('/')
})

app.get('dishes/:dishesId/edit', async (req,res)=>{
    const foundDish = await dishes.findById(req.params.dishesId)
    res.render('edit-dish.ejs',{dishes: foundDish})
})

// server.js


app.listen(3000,()=>{
    console.log("Listening on port " + 3000)
}) // Listen on port 3000
