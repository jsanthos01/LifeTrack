let db = require("./connection")

async function registerDb(data){
    const postUserInfo = await db.query( 
        "INSERT INTO loginInfo (username, useremail,password) VALUES(?,?,?)",
        [ data.username, data.useremail, data.password]);

    return postUserInfo;
}


async function loginUser(email){
    let memberInfo = await db.query('SELECT * FROM loginInfo WHERE useremail=?', [ email ] );
    console.log("line 14: ", memberInfo)
    return memberInfo[0];
}

module.exports = {
    registerDb,
    loginUser
}