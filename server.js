const express = require('express')
const app = express();
const connectDB = require('./config/db');
const path = require('path');

//connect db
connectDB();

app.use(express.json({extended: false}))

//define routes
app.use('/users', require('./routes/api/users'))
app.use('/auth', require('./routes/api/auth'))
app.use('/posts', require('./routes/api/posts'))
app.use('/profile', require('./routes/api/profile'))

// serve static assets in production
if (process.env.NODE_ENV === "production") {
// Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is up port ${PORT}`))