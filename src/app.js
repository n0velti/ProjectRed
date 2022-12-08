import { Amplify, Auth, Hub, Logger,DataStore, API , graphqlOperation  } from 'aws-amplify';
import awsconfig from './aws-exports';
import { PostStatus } from './models'
import {createPost} from './graphql/mutations'
import {createUser} from './graphql/mutations'

import {getUser, listUsers, listPosts} from './graphql/queries'
import * as queries from './graphql/queries';
import * as c_queries from './graphql/custom-queries';
Amplify.configure(awsconfig);

function listenToAutoSignInEvent() {
    Hub.listen('auth', ({ payload }) => {
        const { event } = payload;
        if (event === 'autoSignIn') {
            const user = payload.data;
        } else if (event === 'autoSignIn_failure') {
            // redirect to sign in page
            console.log("no auto signin");
        }
    })
}

listenToAutoSignInEvent();


export async function signUp() {

    console.log(registerEmail.value);

    try {
        const { user } = await Auth.signUp({
            username: registerEmail.value,
            password: registerPassword.value,
            attributes: {
                email: registerEmail.value,          // optional
                phone_number: "",   // optional - E.164 number convention
                // other custom attributes 
            },
            autoSignIn: { // optional - enables auto sign in after user is confirmed
                enabled: true,
            }
        });


        return user;

    } catch (error) {
        console.log('error signing up:', error);
    }
}

export async function signIn() {
    try {
        const user = await Auth.signIn(loginEmail.value, loginPassword.value);
    }catch (error) {
        console.log('error signing in', error);
    }
}

export async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(registerEmail.value, codeConfirm.value);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
}

let userEmailText = document.getElementById("userEmail");
let signOutBtn = document.getElementById("signOutBtn");
let s_form = document.getElementById("signOutForm");
if(signOutBtn)
{
    signOutBtn.addEventListener("click", signOut);

}

if(s_form)
{
    s_form.addEventListener("submit", function(event){
        event.preventDefault();
    })
}

let forUsers = document.getElementById("forUsers");
let forNonUsers = document.getElementById("forNonUsers");

function setupHomeInterface()
{
  let forUsers = document.getElementById("forUsers");
  forUsers.style.display = "block";
  forNonUsers.style.display = "none";
}

async function onStart()
{    
  let user;
  if(isSignedIn())
  {
    user = await Auth.currentAuthenticatedUser();
    if(userEmailText)
    {
        userEmailText.textContent = user.attributes.email;

    }


    console.log("VAL" +user.attributes.sub);

    const usersWithRegisteredID = await API.graphql({
      query: c_queries.getUserByID,
      variables: { userID: user.attributes.sub}
    });

    if(usersWithRegisteredID.data.listUsers.items.length == 0){
        //user not in table
        console.log(usersWithRegisteredID);

        console.log("VAL2" +user.attributes.sub);

        const val =
        {userID: user.attributes.sub,
         userEmail: user.attributes.email
        }
      
      
        await API.graphql(graphqlOperation(createUser, { input: val}));

    }else{
       //user in table
        console.log(usersWithRegisteredID);
    }





    //get user with id
   // let userId =
  //  if()


    setupHomeInterface();
    getPosts();
  }else{
      forUsers.style.display = "none";
      forNonUsers.style.display = "block";
  }
}

async function isSignedIn()
{
  try{
    user = await Auth.currentAuthenticatedUser();
    return true;
  }catch{
    return false;
  }
}

onStart();

async function signOut() {

    try {
        await Auth.signOut();
        console.log(user);

    } catch (error) {
        window.location.reload();
        console.log('error signing out: ', error);
    }
}




const logger = new Logger('My-Logger');

const listener = (data) => {
  switch (data.payload.event) {
    case 'configured':
      logger.info('the Auth module is configured');
      break;
    case 'signIn':
        window.location.href  = "http://localhost:8080/"
        onStart();

      logger.info('user signed in');
      break;
    case 'signIn_failure':
      logger.error('user sign in failed');
      break;
    case 'signUp':
      logger.info('user signed up');
      break;
    case 'signUp_failure':
      logger.error('user sign up failed');
      break;
    case 'confirmSignUp':
      logger.info('user confirmation successful');
      break;
    case 'completeNewPassword_failure':
      logger.error('user did not complete new password flow');
      break;
    case 'autoSignIn':
      logger.info('auto sign in successful');
      break;
    case 'autoSignIn_failure':
      logger.error('auto sign in failed');
      break;
    case 'forgotPassword':
      logger.info('password recovery initiated');
      break;
    case 'forgotPassword_failure':
      logger.error('password recovery failed');
      break;
    case 'forgotPasswordSubmit':
      logger.info('password confirmation successful');
      break;
    case 'forgotPasswordSubmit_failure':
      logger.error('password confirmation failed');
      break;
    case 'tokenRefresh':
      logger.info('token refresh succeeded');
      break;
    case 'tokenRefresh_failure':
      logger.error('token refresh failed');
      break;
    case 'cognitoHostedUI':
      logger.info('Cognito Hosted UI sign in successful');
      break;
    case 'cognitoHostedUI_failure':
      logger.error('Cognito Hosted UI sign in failed');
      break;
    case 'customOAuthState':
      logger.info('custom state returned from CognitoHosted UI');
      break;
    case 'customState_failure':
      logger.error('custom state failure');
      break;
    case 'parsingCallbackUrl':
      logger.info('Cognito Hosted UI OAuth url parsing initiated');
      break;
    case 'userDeleted':
      logger.info('user deletion successful');
      break;
    case 'signOut':
        console.log("out");
      logger.info('user signed out');
      break;
  }
};

Hub.listen('auth', listener);

//DataStore

let postBtn = document.getElementById("postBtn");
if(postBtn){
  postBtn.addEventListener("click", addPost);
}

async function addPost(){
  try {
    let user = await Auth.currentAuthenticatedUser();

    let postTxt = document.getElementById("postText");
    console.log(user.pool.clientId);
    const p = {
      postedByID: user.attributes.sub,
      postContent: postTxt.value,
      status: PostStatus.ACTIVE
    }
  
  
    await API.graphql(graphqlOperation(createPost, { input: p }));
    console.log(user);
    console.log("Post saved successfully!");
  } catch (error) {
    console.log("Error saving post", error);
  }
}



async function getPosts()
{
  let feedContainer = document.getElementById("feedResults");

  let user = await Auth.currentAuthenticatedUser();


  const usersWithRegisteredID = await API.graphql({
    query: c_queries.getUserByID,
    variables: { userID: user.attributes.sub}
  });


  await API.graphql(graphqlOperation(listPosts)).then((evt) => {
        evt.data.listPosts.items.map(async (post, i) => {

          const usersWithRegisteredID = await API.graphql({
            query: c_queries.getUserByID,
            variables: { userID: post.postedByID }
          });

          console.log("tyre" + usersWithRegisteredID.data)

         feedContainer.innerHTML += `<p>${usersWithRegisteredID.data.listUsers.items[0].userEmail} - ${post.postContent}</p>`;
       });
    });
}