const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const userEmail = document.getElementById("userEmail");
const password = document.getElementById("userPassword");

registerBtn.addEventListener("click", () => {
    location.href = "./registration.html"
});


loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    //1. Checked if all the inputs meet the criteria
    if(userEmail.value == "" || password.value == "" ){
        alert( "Please fill in all the inputs!" );
        return;
    }

    //2. Check if user is valid member
    let getInfo = await fetch('/api/login', 
    {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userEmail.value, 
            password: password.value
        })
    }).then(res => res.json());


    if(getInfo){
        localStorage.setItem("userInfo", JSON.stringify({
            email: getInfo.useremail,
            id: getInfo.id,
            name: getInfo.username
        }));

        location.href = "./individual.html"
    }   
})