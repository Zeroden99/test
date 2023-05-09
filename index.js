const express = require('express');

const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth')
const searchRoutes = require('./routes/search')
const postRoutes = require('./routes/post')
const commentRoutes = require('./routes/comment')
const friendRoutes = require('./routes/friend')

dotenv.config()

app.use(express.json())
app.use('/', authRoutes)
app.use('/', searchRoutes)
app.use('/', postRoutes)
app.use('/', commentRoutes)
app.use('/', friendRoutes)

app.use((e, req, res, next) => {
    const status = e.status || 500
    const message = e.message || 'Something Wrong'
    return res.status(status).json({
        success: false,
        status,
        message,
    })
})

PORT = process.env.PORT || 8000


mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('mongoDB Start'))
.catch((e) => {
    console.log(e)
})

app.listen(PORT, ()=> {
    console.log(`Server Start ${PORT}`);
})