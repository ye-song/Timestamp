// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

let responseObject = {}

app.get('/api/:input', (request, response) => {
    let input = request.params.input

    let pattern1 = /[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}/
    let pattern2 = /[0-9]{13}/
    let pattern3 = /[0-9]{1,2}\s[A-Za-z]{3,9}\s[0-9]{4}/
    let result1 = pattern1.test(input)
    let result2 = pattern2.test(input)
    let result3 = pattern3.test(input)

    if(result1==true || result3==true){
        //Date String format: yyyy-mm-dd
        //Date String format: dd month yyyy
        responseObject['unix'] = new Date(input).getTime()
        responseObject['utc'] = new Date(input).toUTCString()
        return response.json(responseObject)
    }
    else if(result2==true){
        //Timestamp numbers xxxxxxxxxxxxx
        input = parseInt(input)

        responseObject['unix'] = new Date(input).getTime()
        responseObject['utc'] = new Date(input).toUTCString()
        return response.json(responseObject)
    }

    //if date is not any of the recognized format
    else if(result1 == false && result2 == false && result3 == false){
        return response.json({error: 'Invalid Date'})
    }

});

//If no date is entered
app.get('/api/', (request, response)=> {
    responseObject['unix'] = new Date().getTime()
    responseObject['utc'] = new Date().toUTCString()

    response.json(responseObject)
});
