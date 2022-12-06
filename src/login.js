

import { signIn } from '../src/app.js';
console.log("loginform")
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginSubmit = document.getElementById("loginSubmit");

let loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event){
    event.preventDefault();
});


loginSubmit.addEventListener('click', signIn);


