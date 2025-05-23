const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const mongo_url = 'mongodb://127.0.0.1:27017/wanderlust';
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


main().then(()=>{
    console.log("connected to db")
}).catch(err => {
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));// to parse the data/to getuse req paramas
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate );

app.get("/",(req, res) =>{
    res.send("root is working")
})

//index route

app.get("/listings",async (req,res)=>{
   const allListings = await listing.find({});
   res.render("./listings/index.ejs",{allListings});
});
//new route, put thos above show route as the browser will misttok new for id
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})


//show route 
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listingEach = await listing.findById(id);
    res.render("./listings/show.ejs",{listingEach})

})

//create route
app.post("/listings",async(req,res)=>{
     const newListing = new listing (req.body.listing);
     console.log(newListing);
     await newListing.save();
     res.redirect("/listings");

})

//edit route
app.get("/listings/:id/edit",async(req,res) =>{
    let {id} = req.params;
    const listingEach = await listing.findById(id);
    res.render("./listings/edit.ejs", {listingEach});
})

//update route
app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`)

})
//delete route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const deleteListing = await listing.findByIdAndDelete(id);
    
    res.redirect("/listings");
})




// app.get("/testListing" ,async (req,res)=>{
//     let sampleTesting = new listing({
//         title : "OAM",
//         description : "thriller",
//         price : 120,
//         location : "delhi",
//         country : "india",
//     });
//     await sampleTesting.save();
//     console.log("sample was saved");
//     res.send("succesfull testing")
// })
app.listen(8080,()=>{
    console.log("server is running")
})