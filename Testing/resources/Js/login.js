//Set global variable legal = "true" so signin is initially valid
var legal = "true";

function validateSignin(){

    var myUser = document.getElementById("signinUsername");
    var myPass = document.getElementById("signinPassword");
    var illegalCharacter = /;|=/g; //Check if input includes ';' or '='

    //As user inputs username check if it contains an illegalCharacter and disable button if it does
    myUser.onkeyup = function() {
        if(myUser.value.match(illegalCharacter)){
            legal = "false";
        } else {
            legal = "true";
        }
        enableSigninButton();
    }

    //As user inputs password check if it contains an illegalCharacter and disable button if it does
    myPass.onkeyup = function() {
        if(myPass.value.match(illegalCharacter)){
            legal = "false";
        } else {
            legal = "true";
        }
        enableSigninButton();
    }
}


function enableSigninButton(){

    let button = document.getElementById('my_signin_button');

    if(legal === "true") {
        button.disabled = false;
    }
    else{
        button.disabled = true;
    }
}

function openModal() {
          
    var myUsername = document.getElementById("username");
    var userLegallity = document.getElementById("userLegallity");
    var myInput = document.getElementById("psw");
    var confirmMyInput = document.getElementById("cpsw");
	var letter = document.getElementById("letter");
	var capital = document.getElementById("capital");
	var number = document.getElementById("number");
	var length = document.getElementById("length");
    var legallity = document.getElementById("legallity");   
    var match = document.getElementById("match");

    var illegalCharacter = /;|=/g;


    //When the user starts to type something inside the username field
    myUsername.onkeyup = function() {

        //Validate legallity
        if(myUsername.value.match(illegalCharacter)){
            userLegallity.classList.remove("valid");
            userLegallity.classList.add("invalid");
        } else {
            userLegallity.classList.remove("invalid");
            userLegallity.classList.add("valid");
        }

        enableButton(letter, capital, number, length, match, legallity, userLegallity);
    }

	// When the user starts to type something inside the password field
	myInput.onkeyup = function() {
        
     
        var lowerCaseLetters = /[a-z]/g; // : Fill in the regular experssion for lowerCaseLetters
        var upperCaseLetters = /[A-Z]/g; // : Fill in the regular experssion for upperCaseLetters
        var numbers = /[0-9]/g; // : Fill in the regular experssion for digits
        var minLength = 8; // : Change the minimum length to what what it needs to be in the question 
        

        // Validate Legallity
        if(myInput.value.match(illegalCharacter)){
            legallity.classList.remove("valid");
            legallity.classList.add("invalid");
        } else {
            legallity.classList.remove("invalid");
            legallity.classList.add("valid");
        }

        // Validate lowercase letters
        if(myInput.value.match(lowerCaseLetters)) {             
            letter.classList.remove("invalid"); 
            letter.classList.add("valid"); 
        } else {
            letter.classList.remove("valid"); 
            letter.classList.add("invalid"); 
        }

        // Validate capital letters        
        if(myInput.value.match(upperCaseLetters)) { 
            capital.classList.remove("invalid"); 
            capital.classList.add("valid");
        } else {
            capital.classList.remove("valid");
            capital.classList.add("invalid");
        }

        // Validate numbers        
        if(myInput.value.match(numbers)) { 
            number.classList.remove("invalid"); 
            number.classList.add("valid"); 
        } else {
            number.classList.remove("valid"); 
            number.classList.add("invalid");
        }

        // Validate length
        if(myInput.value.length >= minLength) {
            length.classList.remove("invalid");
            length.classList.add("valid");
        } else {
            length.classList.remove("valid");
            length.classList.add("invalid");
        }
        
    }
    
    confirmMyInput.onkeyup = function() {
                // Validate password and confirmPassword
                var passEqualsConfPass = (myInput.value === confirmMyInput.value);
                
                if(passEqualsConfPass) { 
                    match.classList.remove("invalid"); 
                    match.classList.add("valid"); 
                } else {
                    match.classList.remove("valid"); 
                    match.classList.add("invalid"); 
                }        


    enableButton(letter, capital, number, length, match, legallity, userLegallity);
    }
}


function enableButton(letter, capital, number, length, match, legallity, userLegallity) {

    let result = userLegallity.classList[0] === "valid" && legallity.classList[0] === "valid" && letter.classList[0] === "valid" && capital.classList[0] === "valid" && number.classList[0] === "valid" && length.classList[0] ==="valid" && match.classList[0] === "valid";

    let button = document.getElementById('my_submit_button');
    
    if(result) {       
        button.disabled = false;
    }
    else{
        button.disabled = true;
    }
}