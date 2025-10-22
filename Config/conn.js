const mongoose = require('mongoose');
require('dotenv').config()
const uri = process.env.MONGOOSE_URL 
const connectedDb = async ()=>{
    try {
        await mongoose.connect(uri);
        console.log('Database is connected on Atlas')
    } catch (error) {
        console.error(`Mongoose Connection Server Error ${error.message}`);
    }
}

module.exports = {connectedDb}