const express = require('express');

const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')

dotenv.config()

app.use(express.json())
app.use('/', authRoutes)

PORT = process.env.PORT || 8000

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('mongoDB Start'))
.catch((e) => {
    console.log(e)
})

app.listen(PORT, ()=> {
    console.log(`Server Start ${PORT}`);
})