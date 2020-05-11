const express = require('express');
const orm = require('./db/orm');
const PORT = process.env.PORT || 8080;
const app = express();

//used for bcryption of password 
const bcrypt = require ("bcrypt");
const saltRounds = 10;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//posts user's registration information inside database
app.post("/api/registration", async function(req, res){    
    bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        // Store hash in your password DB.
        const data = {
            username: req.body.userName,
            useremail: req.body.userEmail,
            password: hash
        }

        let registered = await orm.registerDb(data);
        registered ? res.send({message: "Success!"}) : null ;
    });
})

app.listen(PORT, function () {
    console.log(`[lifeTrack] RUNNING, http://localhost:${PORT}`);
});