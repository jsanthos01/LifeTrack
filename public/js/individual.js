
$(document).ready( async function(){
    const editId = location.hash.substr(1)
    if ( editId && editId > 0){

    //fetching my profile img
    let userData = localStorage.getItem("myUser");
    userData = JSON.parse(userData);
    console.log(userData);
    let myName = userData.my_name;
    console.log(myName);
    const idx = userData.userId;

    const myUserInfo = await $.get(`/api/dashboardInfo/${idx}`);
    console.log('my user is ' + myUserInfo[0]);

    $("#navMenu").empty();
    $("#navMenu").html(`
        <ul class="card-body text-center">
            <div class="text-right" id="menuCloseBtn">
            <i class="fa fa-times" onClick="hideMenu()" aria-hidden="true"></i>
            </div>
            <img src="${myUserInfo.user_img}" alt="" class="profilePicture m-2 " style="width: 75px; height: 75px;">
            <li class="navItem"><a class="navLink" href="individual.html">My Profile</a></li>
            <li class="navItem"><a class="navLink" href="groups.html" >View Groups</a></li>
            <li class="navItem"><a class="navLink" onclick="logOutBtn()">Log Out</a></li>
        </ul>`)
    $(".thumbProfileimg").html(`<img src="${myUserInfo.user_img}" alt="" class="profilePicture m-2 " style="width: 50px; height: 50px;">`);

    //fetching others profile
    const result = await $.get(`/api/userProfile/${editId}`);
    console.log(result);

    $("#userProfilePicture").html(`<img src="${result.user_img}" alt="" class="profilePictureBig">`)
    $("#h1Value").html(`${result.my_name}`);
    $("#appendWeight").html(`Weight: ${result.my_weight}`);
    $("#appendHeight").html(`Height: ${result.height}`);
    $("#usersMainGoal").html(`${result.goal}`);
    $("#appendBMI").html(`BMI: ${result.BMI}`);
    $("#appendBMI").html(`BMI: ${result.BMI}`);

    $("#thumbnailList").remove();
    $("#goalCard").removeClass('hide');
    $("#visitorGoalBar").remove();
    $(".disableCrossBtn").remove();

    const getGoalInfoForOtherProfile = await $.get(`/api/getGoal/${editId}`);
    
    //Display Goals
    getGoalInfoForOtherProfile.forEach( (message) => {
    if(message.goal_range == "Daily"){
        $("#dailyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">

            </div>
            </div>
        </div>`
        )
    }else if (message.goal_range == "Weekly"){
        $("#weeklyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">
            </div>  
            </div>
        </div>`
        )
    }else if(message.goal_range == "Monthly") {
        $("#monthlyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">
            </div>
            </div>
        </div>`
        )
    }
    });

    appendCompletedGoalList(editId);

    } else {

    if(localStorage != null){
        let userData = localStorage.getItem("myUser");
        userData = JSON.parse(userData);
        console.log(userData);
        let myName = userData.my_name;
        console.log(myName);
        $("#h1Value").html(myName);

        const idx = userData.userId;
        appendGoals(idx)
        appendCompletedGoalList(idx)

        const myUserInfo = await $.get(`/api/dashboardInfo/${idx}`);
        console.log('my user is ' + myUserInfo.height);

        if( myUserInfo.height == null || myUserInfo.my_weight  == null || myUserInfo.goal  == null || myUserInfo.BMI  == null){
        console.log("helloooooooooooooooooooo")
        $("#appendWeight").html(`Weight:`);
        $("#appendHeight").html(`Height:`);
        $("#usersMainGoal").html(`Goal:`);
        $("#appendBMI").html(`BMI:`);

        }else {
        $("#appendWeight").html(`Weight: ${myUserInfo.my_weight}`);
        $("#appendHeight").html(`Height: ${myUserInfo.height}`);
        $("#usersMainGoal").html(`${myUserInfo.goal}`);
        $("#appendBMI").html(`BMI: ${myUserInfo.BMI}`);
        
        if (myUserInfo.user_img != null){
            $( ".thumbProfileimg" ).html( `<img src="${myUserInfo.user_img}" alt="" class="profilePicture m-2 " style="width: 50px; height: 50px;">`);
            $("#userProfilePicture").html(`<img src="${myUserInfo.user_img}" alt="" class="profilePictureBig">`);
        }
        }
    }
    
    }
});

async function insertInfo() {
    let userData3 = localStorage.getItem("myUser");
    userData3 = JSON.parse(userData3);
    console.log(userData3.userName);
    userName = userData3.userName;
    userId= userData3.userId

    hideAddInfo();
    console.log("I AM CLICKED")
    let weight = $( "#insertWeight" ).val();
    let height = $( "#insertHeight" ).val();
    let goal = $( "#insertGoal" ).val();
    let imgUrl = $( "#profileImg" ).val();
    let bmi = Number(weight) / Math.pow(Number(height), 2);

    console.log(`This is the bmi: ${bmi}`);

    let myDashboardInfo = {
    userName: userName,
    inputWeight: weight,
    inputHeight: height,
    inputGoal: goal,
    inputUrl: imgUrl,
    bmi:bmi
    }
    console.log(myDashboardInfo)
    const postInfo = await $.post("/api/userInfo", myDashboardInfo);
    console.log(`this is the response ${postInfo}`);

    const getInfo = await $.get(`/api/dashboardInfo/${userId}`);
    $("#appendWeight").html(`Weight: ${getInfo.my_weight}`);
    $("#appendHeight").html(`Height: ${getInfo.height}`);
    $("#usersMainGoal").html(`${getInfo.goal}`);
    $("#appendBMI").html(`BMI: ${getInfo.BMI}`);

    if (getInfo.user_img != null){
    $( ".thumbProfileimg" ).html( `<img src="${getInfo.user_img}" alt="" class="profilePicture m-2 " style="width: 50px; height: 50px;">`);
    $("#userProfilePicture").html(`<img src="${getInfo.user_img}" alt="" class="profilePictureBig">`);
    }
}
    
async function editInfo(){
    hideEditInfo();
    console.log("Edit Buttpn : I AM CLICKED")
    let weight = $( "#editWeight" ).val();
    let height = $( "#editHeight" ).val();
    let goal = $( "#editGoal" ).val();
    let bmi = Number(weight) / Math.pow(Number(height), 2);
    let imgUrl = $( "#editProfileImg" ).val();

    console.log(`This is the bmi edited: ${bmi}`);

    //get username and post inside database
    let userData = localStorage.getItem("myUser");
    userData = JSON.parse(userData);
    let userName = userData.userName;
    console.log(userName);
    // let name = userData.my_name;
    let userId = userData.userId;

    let userDashboardInfo = {
    userName: userName,
    inputWeight: weight,
    inputHeight: height,
    inputGoal: goal,
    bmi:bmi,
    inputUrl: imgUrl,
    };

    console.log(userDashboardInfo);

    const postInfo = await $.post("/api/userInfo", userDashboardInfo);
    console.log("Getting the Post Info Stuff from edit function!!!!");
    console.log(postInfo);

    //get the info from database so that it can be added to html
    const getInfo = await $.get(`/api/dashboardInfo/${userId}`);
    $("#appendWeight").html(`Weight: ${getInfo.my_weight}`);
    $("#appendHeight").html(`Height: ${getInfo.height}`);
    $("#usersMainGoal").html(`${getInfo.goal}`);
    $("#appendBMI").html(`BMI: ${getInfo.BMI}`);

    if (getInfo.user_img != null){
    $( ".thumbProfileimg" ).html( `<img src="${getInfo.user_img}" alt="" class="profilePicture m-2 " style="width: 50px; height: 50px;">`);
    $("#userProfilePicture").html(`<img src="${getInfo.user_img}" alt="" class="profilePictureBig">`);
    }
}

function logOutBtn(){
    localStorage.clear();
    location.href = '/login.html';
}

function recipeCall(){
    var chosenDiet = $("#inputGroupSelectDiet").val();
    $("#addDietName").html(`Current Diet Following: ${chosenDiet}`);

    $.ajax({
    url: `https://api.spoonacular.com/recipes/search?apiKey=db254b5cd61744d39a2deebd9c361444&number=3&query=${chosenDiet}`,
    method: "GET"
    }).then(showRecipes);
}

function showRecipes(response){
    $("#dietSections").empty();
    console.log(response);
    console.log(response.results[0].imageUrls)
    for(var i = 0; i<3; i++){ 
    $("#dietSections").append(
        `
        <div class="card">
        <img class="card-img-top thumbnail-size" src="https://spoonacular.com/recipeImages/${response.results[i].imageUrls}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${response.results[i].title}</h5>
            <p class="card-text">${response.results[i].readyInMinutes} minutes</p>
        </div>
        <div class="card-body">
            <a id="food${i}"href="https://spoonacular.com/${response.results[i].title}" class="btn btn-primary">Show Recipe</a>
        </div>
        </div>
        `
    );
    }
}

function fitnessWorkoutCall(){
    var chosenFitnessCategory = $("#inputGroupSelectFitness").val();
    $("#currentFitness").html(`Focusing on ${chosenFitnessCategory} today`);
    $("#fitnessSections").empty();

    let fitnessNames = [];
    if(chosenFitnessCategory == "Abs"){
    fitnessNames = ["Crunches", "Arch Hold","Ankle Taps" ];

    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(absWorkout);
    });

    }else if(chosenFitnessCategory == "Arms"){
    fitnessNames = ["Back Squat", "Axe Hold", "Barbell Squat"]

    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(armsWorkout);
    })
    
    }else if(chosenFitnessCategory == "Back"){
    fitnessNames = ["Back, Shoulder, And Leg Stretching.", "Arch Hold", "Bent Over Barbell Row"]
    
    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(backWorkout);
    })

    }else if(chosenFitnessCategory == "Calves"){
    fitnessNames = ["2 Handed Kettlebell Swing", "Arch Hold"]
    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(calvesWorkout);
    })

    }else if(chosenFitnessCategory == "Chest"){
    fitnessNames = ["Benchpress Dumbbells", "Bear Walk"]
    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(chestWorkout);
    })

    }else if(chosenFitnessCategory == "Legs"){
    fitnessNames = ["Barbell Hip Thrust", "Barbell Lunges", "Barbell Reverse Lunge - Clean Grip"]
    fitnessNames.forEach( (names) => {
        $.ajax({
        url: `https://wger.de/api/v2/exerciseinfo/?name=${names}`,
        method: "GET"
        }).then(legsWorkout);
    })
    }

}

function absWorkout(response){
    if(response.results[0].name == "Ankle Taps"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/ankletaps.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://sworkit.com/exercise/ankle-taps" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Crunches"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/crunches.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.dummies.com/health/exercise/how-to-do-crunches/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Arch Hold"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/archhold.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://holycitycrossfit.com/arch-and-hollow-body-positions-in-movement/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}
function armsWorkout(response){
    if(response.results[0].name == "Back Squat"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/backsquat.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.crossfit.com/essentials/the-back-squat" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Axe Hold"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/axehold.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.health.com/fitness/how-to-do-axe-chop-exercise" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Barbell Squat"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/barbelsquat.png" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.coachmag.co.uk/barbell-exercises/6705/how-to-master-the-barbell-back-squat" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}
function backWorkout(response){
    if(response.results[0].name == "Back, Shoulder, And Leg Stretching."){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/stretches.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.webmd.com/fitness-exercise/features/how-to-stretch" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Arch Hold"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/archhold.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://holycitycrossfit.com/arch-and-hollow-body-positions-in-movement/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Bent Over Barbell Row"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/bentoverbarbel.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}
function legsWorkout(response){
    if(response.results[0].name == "Barbell Hip Thrust"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/Barbell-Hip-Thrust.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.menshealth.com/uk/fitness/a753444/barbell-lunge/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Barbell Lunges"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/barbelLunge.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.menshealth.com/uk/fitness/a753444/barbell-lunge/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Barbell Reverse Lunge - Clean Grip"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/reverseLunges.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.menshealth.com/uk/fitness/a753444/barbell-lunge/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}

function calvesWorkout(response){
    if(response.results[0].name == "2 Handed Kettlebell Swing"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/2-handed-swing.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://www.onnit.com/academy/kettlebell-exercise-2-hand-swing/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Arch Hold"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/archhold.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="https://holycitycrossfit.com/arch-and-hollow-body-positions-in-movement/" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}
function chestWorkout(response){
    if(response.results[0].name == "Benchpress Dumbbells"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/benchpress.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="#" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }else if(response.results[0].name == "Bear Walk"){
    $("#fitnessSections").append(`<div class="card">
        <img class="card-img-top thumbnail-size" src="assets/fitnessImg/Bear-Walk.jpg" alt="Card image cap" class="img-fluid">
        <div class="card-body">
        <h5 class="card-title">${response.results[0].name}</h5>
        </div>
        <div class="card-body">
        <a href="#" class="btn btn-primary">Show Workout</a>
        </div>
    </div>`)
    }
}

//Animation effects 
function hideMenu(){
    $( "#navMenu" ).hide( "slow" );
}
function hideAddInfo(){
    $( "#addInfoWin" ).hide( "slow" );
}
function hideEditInfo(){
    $( "#editInfoWin" ).hide( "slow" );
}
function showAddInfo(){
    $( "#addInfoWin" ).slideDown( "slow" );
    $( "#navMenu" ).hide( "slow" );
}
function showEditInfo(){
    $( "#editInfoWin" ).slideDown( "slow" );
    $( "#navMenu" ).hide( "slow" );
}

function showMenu(){
    $( "#navMenu" ).show( "slow" );
};

function showGoalCard(){
    $( "#goalCard" ).show( 1500 );
    $('html, body').animate({
    scrollTop: $("#goalCard").offset().top
    }, 1500);

    let usersDataId = localStorage.getItem("myUser");
    usersData = JSON.parse(usersDataId);
    console.log(usersData);
    let myName = usersData.my_name;
    let myId = usersData.userId; 
    appendGoals(myId);
    appendCompletedGoalList(myId);
}
function hidegoalCard(){
    $( "#goalCard" ).hide( "slow" );
}

function showDietCard(){
    $( "#dietCard" ).show( 1500 );
    $('html, body').animate({
    scrollTop: $("#dietCard").offset().top
    }, 1500);
}

function hideDietCard(){
    $( "#dietCard" ).hide( "slow" );
}

function showfitnessCard(){
    $( "#fitnessCard" ).show( 1500 );
    $('html, body').animate({
    scrollTop: $("#fitnessCard").offset().top
    }, 1500);
}

function hidefitnessCard(){
    $( "#fitnessCard" ).hide( "slow" );
}

function addGoalInfo(){
    $("#addGoalInsideCard").empty();
    $("#addGoalInsideCard").append(
    `
    <div class="input-group mb-3 ">
        <select class="custom-select" id="goalRangeChoice">
        <option>Choose your Goal Range</option>
        <option value="Daily">Daily</option>
        <option value="Weekly">Weekly</option>
        <option value="Monthly">Monthly</option>
        </select>
        <div class="input-group-append">
        <label class="input-group-text" for="inputGroupSelectDiet">Options</label>
        </div>
    </div>
    <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Write Your Goal Here" aria-label="Recipient's username" aria-describedby="button-addon2" id="inputSaveText">
        <div class="input-group-append">
        <button class="btn btn-outline-warning" type="button" id="button-addon2" onclick="saveGoal()">Save</button>
        </div>
    </div>
    `
    )
}


async function saveGoal(){
    var saveGoalInput = $("#inputSaveText").val();
    var goalRange = $("#goalRangeChoice option:selected").val();
    $("#dailyGoals").empty();
    $("#WeeklyGoals").empty();
    $("#MonthlyGoals").empty();

    console.log(goalRange);

    let user2Data = localStorage.getItem("myUser");
    user2Data = JSON.parse(user2Data);
    console.log(user2Data);
    let myName = user2Data.my_name;
    let myId = user2Data.userId; 
    console.log(myName);

    var goalInfoStore = {
    goalRange: goalRange,
    goalInput: saveGoalInput,
    goalCompleted: 0,
    userId: myId
    }
    //post the goal to db 
    const postGoalInfo = await $.post("/api/postGoal", goalInfoStore);

    //get the goal from db and append to correct div
    $("#addGoalInsideCard").empty();
    appendGoals(myId);
}

async function appendGoals(editId){
    const getGoalInfoForOtherProfile = await $.get(`/api/getGoal/${editId}`);
    console.log('why is it not appending the goal: what :' + getGoalInfoForOtherProfile + ' editId: ' + editId )
    $("#dailyGoals").empty()
    $("#weeklyGoals").empty()
    $("#monthlyGoals").empty()

    getGoalInfoForOtherProfile.forEach( (message) => {
    if(message.goal_range == "Daily"){
        $("#dailyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">
                <input type="checkbox" aria-label="Checkbox for following text input" onchange="goalChanged(${message.goal_id}, ${message.userId})">
            </div>
            </div>
        </div>`
        )
    }else if (message.goal_range == "Weekly"){
        $("#weeklyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">
                <input type="checkbox" aria-label="Checkbox for following text input" onchange="goalChanged(${message.goal_id}, ${message.userId})">
            </div>
            </div>
        </div>`
        )
    }else if(message.goal_range == "Monthly") {
        $("#monthlyGoals").append(
        `<div class="card-body input-group mb-3" id="goal${message.goal_id}">
            <p class="list-group-item form-control">${message.goal_message}</p>
            <div class="input-group-append">
            <div class="input-group-text bg-success">
                <input type="checkbox" aria-label="Checkbox for following text input" onchange="goalChanged(${message.goal_id}, ${message.userId})">
            </div>
            </div>
        </div>`
        )
    }
    });
}

async function goalChanged(goalId, personalId){
    $(`#goal${goalId}`).remove();

    const goalUpdate = await $.ajax({
    url: `/api/goalUpdate/${goalId}`,
    type: "PUT"
    });
    appendCompletedGoalList(personalId);
}

//Animation Effects
function showDailyList(){
    $('.detailDailyList').removeClass('hide');
    $('#showHideDaily').html('<i class="fa fa-angle-up" aria-hidden="true" onClick="hideDailyList()"></i>')
}

function hideDailyList(){
    $('.detailDailyList').addClass('hide');
    $('#showHideDaily').html('<i class="fa fa-angle-down" aria-hidden="true" onClick="showDailyList()"></i>')
}

function showWeeklyList(){
    $('.detailWeeklyList').removeClass('hide');
    $('#showHideWeekly').html('<i class="fa fa-angle-up" aria-hidden="true" onClick="hideWeeklyList()"></i>')
}

function hideWeeklyList(){
    $('.detailWeeklyList').addClass('hide');
    $('#showHideWeekly').html('<i class="fa fa-angle-down" aria-hidden="true" onClick="showWeeklyList()"></i>')
}

function showMonthlyList(){
    $('.detailMonthlyList').removeClass('hide');
    $('#showHideMonthly').html('<i class="fa fa-angle-up" aria-hidden="true" onClick="hideMonthlyList()"></i>')
}

function hideMonthlyList(){
    $('.detailMonthlyList').addClass('hide');
    $('#showHideMonthly').html('<i class="fa fa-angle-down" aria-hidden="true" onClick="showMonthlyList()"></i>')
}

async function appendCompletedGoalList(personalId){
    const getCompletedGoalInfo = await $.get(`/api/getCompletedGoalOthers/${personalId}`);
    $(`#appendCompltedDailyGoal`).empty();
    $(`#appendCompltedWeeklyGoal`).empty();
    $(`#appendCompltedMonthlyGoal`).empty();

    getCompletedGoalInfo.forEach( (message) => {
    var calendar = message.updatedTime
    var time = moment(calendar).fromNow();
    if(message.goal_range == "Daily"){
        $(`#appendCompltedDailyGoal`).append(`
        <div class="input-group mb-2 mt-2 ">
            <div class="form-control ">
            <h5>${message.goal_message}</h5>
            <div class="progress ">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 100%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="text-muted font-weight-light">finished ${time}</p>
            </div>
            <div class="input-group-append">
            <span class="btn btn-success btn-lg disabled"><i class="fa fa-check" aria-hidden="true"></i></span>
            </div>
        </div>`
        ) 
    }else if (message.goal_range == "Weekly"){
        $("#appendCompltedWeeklyGoal").append(
        `
        <div class="input-group mb-2 mt-2 ">
            <div class="form-control ">
            <h5>${message.goal_message}</h5>
            <div class="progress ">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 100%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="text-muted font-weight-light">finished ${time}</p>
            </div>
            <div class="input-group-append">
            <span class="btn btn-success btn-lg disabled"><i class="fa fa-check" aria-hidden="true"></i></span>
            </div>
        </div>`
        )
    }else if(message.goal_range == "Monthly") {
        $("#appendCompltedMonthlyGoal").append(
        `
        <div class="input-group mb-2 mt-2 ">
            <div class="form-control ">
            <h5>${message.goal_message}</h5>
            <div class="progress ">
                <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: 100%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <p class="text-muted font-weight-light">finished ${time}</p>
            </div>
            <div class="input-group-append">
            <span class="btn btn-success btn-lg disabled"><i class="fa fa-check" aria-hidden="true"></i></span>
            </div>
        </div>`
        )
    }
    });
}
