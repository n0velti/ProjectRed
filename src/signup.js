import { signUp } from '../src/app.js';
import {confirmSignUp} from '../src/app.js';

let registerEmail = document.getElementById("registerEmail");
let registerPassword = document.getElementById("registerPassword");
let r_registerPassword = document.getElementById("r_registerPassword");
let registerSubmit = document.getElementById("registerSubmit");
let f = document.getElementById("registerForm");

let codeConfirm = document.getElementById("codeConfirm");
let codeSubmit = document.getElementById("confirmBtn");
let f2 = document.getElementById("confirmForm");

let x;

 f.addEventListener("submit", function(event){
   event.preventDefault();
 })


 f2.addEventListener("submit", function(event){
    event.preventDefault();
  })


registerSubmit.addEventListener('click',  function(){
    x = signUp();
    console.log(x);
});

codeSubmit.addEventListener('click', function(){
    confirmSignUp();
});




