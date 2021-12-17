var ex = require('express');
var lib = require('./app2');

var app = ex();
app.set('view engine', 'ejs');
app.get('/send', function (req, res) {
    res.render('sign.ejs', { xml: lib.SXML() });
});

app.listen(8080);