const mongoose = require ("mongoose");

const initData = require("./datas.js");

const listing = require("../models/listing.js");

const mongoUrl = ("mongodb://127.0.0.1:27017/wanderLust");

main().then(()=>{
    console.log("connected to URL")
}).catch((err)=>console.log(err));

async function main () {
    await mongoose.connect(mongoUrl);
};

const initDb = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"66899925817ece468b1e51b7"}));
    await listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDb();
