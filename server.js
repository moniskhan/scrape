var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8081;
// set the view engine to ejs
//app.set('view engine', 'ejs');
//app.use(express.static(__dirname));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res, next){
    
    url = 'http://www.history.com/this-day-in-history';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var jsonList = { historicalEvent: [] };

            $('.categories').filter(function(){
                var data = $(this);

                data.children().last().children().each(function(i) {
                    var element = $(this).children();
                    var title, link, date;
                    if (element.first().attr('class') == "year"){
                        date = element.first().text();
                        title = element.last().text();
                        link = url + element.last().attr('href');

                        jsonList.historicalEvent.push({ 
                            "title" : date,
                            "date"  : title,
                            "link"  : link
                        });
                    }
                });
            })
        }


        //fs.writeFile('output.json', JSON.stringify(jsonList, null, 4), function(err){
        //
        //    console.log('File successfully written! - Check your project directory for the output.json file');
        //})
        
        res.header('Content-type','application/json');
        res.header('Charset','utf8');
        res.jsonp(jsonList);
    })
})

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

exports = module.exports = app;