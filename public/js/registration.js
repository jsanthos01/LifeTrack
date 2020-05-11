const myName = document.getElementById("myName");
const userEmail = document.getElementById("userEmail");
const password = document.getElementById("userPassword");
const submitUserBtn = document.getElementById("submitUserBtn");

submitUserBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    
    //1. Checked if all the inputs meet the criteria
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(userEmail.value == "" || password.value == "" || myName.value == ""){
        alert( "Please fill in all the inputs!" );
        return;
    }

    if(!(mailformat.test(userEmail.value))) {
        alert( "Please provide valid Email!" );
        userEmail.focus() ;
        return;
    }

    if(userPassword.value.length <8 ) {
        alert( "Please provide a password that is atleast 8 character long" );
        userPassword.focus() ;
        return;
    }

    //2. Store userInfo for session tracking
    const userInfo = {
        userName: myName.value,
        userEmail: userEmail.value,
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    //2. Store info inside database
    const databaseStorage = {
        userName: myName.value,
        userEmail: userEmail.value,
        password: password.value
    }

    let storedInfo = await fetch('/api/registration', 
    {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(databaseStorage)
    }).then(res => res.json())

    alert( storedInfo.message );
    if( storedInfo.message ){
        location.href = '/login.html';
    }

})