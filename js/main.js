"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $favoriteStoriesList = $("#favorite-stories-list");
const $myStoriesList = $("#my-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $storyForm = $("#story-form");
const $storyFormButton = $("#storyform-button");

const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navSubmit = $("#nav-submit");
const $navFavorites = $("#nav-favorites");
const $navMyStories = $("#nav-myStories");

/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [$allStoriesList, $loginForm, $signupForm, $favoriteStoriesList, $myStoriesList];
  components.forEach((c) => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) updateUIOnUserLogin();
}

// Once the DOM is entirely loaded, begin the app

console.warn(
  "HEY STUDENT: This program sends many debug messages to" +
    " the console. If you don't see the message 'start' below this, you're not" +
    " seeing those helpful debug messages. In your browser console, click on" +
    " menu 'Default Levels' and add Verbose"
);
$(start);

// DONE! when a user logs in, make sure the submit, favorites and my stories buttons appear in the nav bar
// DONE! Make html for story form by adding 3 fields: author (placeholder = author name), title (placeholder=story title) and url (placeholder = story url) and create submit button
// DONE! when click nav bar submit button, make new story form appear with button
// DONE! add event listener when form submit button is clicked, call addStory method and await getAndShowStoriesOnStart function (refreshes story list on page to show added story) and hide the submit form.
// DONE! To get arguments for addStory, token=currentUser.loginToken, create newStory object {title=title.value, url=url.value, author=author.value}

// look to see if there is already a showloggedInButtons function or create my own to remove "hidden" class (show buttons after login)
// look to see if there is already a hideLoggedInButton function or create my own to add "hidden" class to buttons (hides buttons when log out)
