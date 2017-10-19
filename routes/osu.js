var express = require('express');
var router = express.Router();
var models = require('../models');
var config = require('../config/config');
models.init();
// initialize the Fitbit API client

console.log("step1");
//profile page
router.get('/val', function (request, response) {
    response.send("Hello Profile" + config.callback_url);
});


// handle the callback from the Fitbit authorization flow
router.post("/valUser", function (req, res, next) {
    console.log(req.body.userId);
    models.Osu.load(req.body.userId, req.body.password, (err, results) => {
        if (err) return next(err);
        res.contentType('application/json');
        if (results.length != 0) {
            var user = { "success": "Dave" }
        }
        else {
            var user = { "error": "Oh God" }
        }
        console.log(user);
        // Normally, the would probably come from a database, but we can cheat:


        // Since the request is for a JSON representation of the people, we
        //  should JSON serialize them. The built-in JSON.stringify() function
        //  does that.
        var peopleJSON = JSON.stringify(user);

        // Now, we can use the response object's send method to push that string
        //  of people JSON back to the browser in response to this request:
        res.send(peopleJSON);
    });
});

router.post("/regUser", function (req, res, next) {

    models.Osu.insert(req.body.userId, req.body.password, req.body.name, (err, results) => {
        if (err) return next(err);
        res.contentType('application/json');
        if (results.length != 0) {
            var user = { "success": "Dave" }
        }
        else {
            var user = { "error": "Oh God" }
        }
        console.log(user);
        // Normally, the would probably come from a database, but we can cheat:


        // Since the request is for a JSON representation of the people, we
        //  should JSON serialize them. The built-in JSON.stringify() function
        //  does that.
        var peopleJSON = JSON.stringify(user);

        // Now, we can use the response object's send method to push that string
        //  of people JSON back to the browser in response to this request:
        res.send(peopleJSON);
    });
});

// test 1
// handle the callback from the Fitbit authorization flow
router.get("/devices", function (req, res, next) {
    // exchange the authorization code we just received for an access token
    //client.getAccessToken(req.query.code, config.callback_url).then(function (result) {
    // use the access token to fetch the user's devices information
    var id = parseInt(req.query.deviceId);
    console.log("Here step 1" + id);
    var access_token = "";
    if (id)
        models.Fitbit.load(id, (err, results) => {
            //if (err) return next(err);
            //console.log(results);
            access_token = results[0].ACCESSTOKEN;
            //console.log(access_token + "in i");
            client.get("/devices.json", access_token).then(function (results) {
                console.log(results[0]);
                res.send(results[0]);
                //});
            }).catch(function (error) {
                res.send(error);
            });
        });
    else
        res.send("Please enter valid Id");
    //console.log(access_token + "in jjjjjj");

});


//test2 
// handle the callback from the Fitbit authorization flow
router.get("/steps", function (req, res, next) {
    // exchange the authorization code we just received for an access token
    //client.getAccessToken(req.query.code, config.callback_url).then(function (result) {
    // use the access token to fetch the user's devices information
    var id = req.query.deviceId;
    var date1 = req.query.date;
    var access_token = "";
    var refresh_token = "";
    if (id)
        models.Fitbit.load(id, (err, results) => {
            if (err) return next(err);
            access_token = results[0].ACCESSTOKEN;
            refresh_token = results[0].REFRESHTOKEN;


            client.get("/activities/steps/date/" + date1 + "/" + date1 + ".json", access_token).then(function (results) {

                if (results[0].success == false) {
                    client.refreshAccessToken(access_token, refresh_token).then(function (result) {
                        models.Fitbit.update(result.access_token, result.refresh_token, 111, (err, results) => {
                            if (err) return next(err);
                        });

                        client.get("/activities/steps/date/" + date1 + "/" + date1 + ".json", result.access_token).then(function (results) {
                            res.send(results[0][2]);
                        });
                    }).catch(function (error) {
                        res.send(error);
                    });

                }
                else {

                    res.send("For the date : " + results[0]["activities-steps"][0]["dateTime"] + " Your step count " + results[0]["activities-steps"][0]["value"]);

                }

            }).catch(function (error) {
                res.send(error);
            });
        });
    else
        res.send("Please enter valid Id");
});

//test3

router.get("/profile1", function (req, res) {
    client.get("/profile.json", access_token).then(function (results) {
        res.send("Welcome " + results[0].user.fullName + results[0].user.encodedId + "You walked :" + results[0].user.averageDailySteps);
    }).catch(function (error) {
        res.send(error);
    });
});




module.exports = router;
