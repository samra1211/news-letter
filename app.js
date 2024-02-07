const express = require('express') ;
const request = require('request') ;
const bodyParser = require('body-parser') ;
const https = require('https') ;
const { log } = require('console');
require('dotenv').config() ;

const app = express() ;

app.use(express.static("public")) ; 
app.use(bodyParser.urlencoded({extended: true})) ;

app.get("/", (req, res) => {
        res.sendFile(__dirname + "/signup.html");
    }) ;

app.post("/", (req, res) => {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;

        const data = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
                }
            ]
        };

        const jsonData = JSON.stringify(data);
        const url = "https://us21.api.mailchimp.com/3.0/lists/773ae5fa3b";
        const API_Key = process.env.API_KEY ;
        const options = {
            method: "POST",
            auth: "samra1:" + API_Key
        };

        const request = https.request(url, options, (response) => {
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            }
            else {
                res.sendFile(__dirname + "/failure.html");
            }

            var data = '';

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
            try {
                const parsedData = JSON.parse(data);
                console.log(parsedData);
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
            });

            
        });

        request.write(jsonData);
        request.end();
    }) ;

app.post("/failure", (req, res) => {
        res.redirect("/");
    }) ;

app.listen(process.env.PORT || 3000, () => {
        console.log("Server is running on port 3000.");
    }) ;

module.exports = app;
// ListID : 773ae5fa3b