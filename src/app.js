const express = require('express')
const ejs = require('ejs');
const path = require('path')

const app = express()
const port = 8080

app.use(express.static(path.join(__dirname, './../public')));
app.set('views', path.join(__dirname, './../public/views'));
app.set('view engine', 'ejs');

require('./api/user.js')(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})