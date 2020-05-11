let db = require("./connection")

async function registerDb(data){
    console.log("Inside orm.js", data);
    const postUserInfo = await db.query( 
        "INSERT INTO loginInfo (username, useremail,password) VALUES(?,?,?)",
        [ data.username, data.useremail, data.password]);

    console.log("Orm.js [postUserInfo]: ", postUserInfo)
    return postUserInfo;
}

module.exports = {
    registerDb
}