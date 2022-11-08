"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $favoriteStoriesList.empty();
  $myStoriesList.empty();
  $storyForm.hide();
  $("p").text("");
  $("span").text("");
  $("h3").text("");
  $("#label-name").text(``);
  $("#label-username").text(``);
  $("#label-accountCreated").text(``);
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup form on click on "login/signup" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navFavorites.show();
  $navMyStories.show();
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// when a user clicks 'submit a story' in the nav bar, the form for adding a story pops up

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  putStoriesOnPage();
  $("p").text("");
  $("span").text("");
  $("h3").text("");
  $("#label-name").text(``);
  $("#label-username").text(``);
  $("#label-accountCreated").text(``);
  $myStoriesList.hide();
  $favoriteStoriesList.hide();
  $storyForm.show();
  // $(".storyform-input").val = "";
  $(".storyform-input").children("input").val("");
}

$navSubmit.on("click", navSubmitClick);

// when a user clicks 'favorites' in the nav bar, show list of favorite stories or a message if no stories have been favorited

$("nav").on("click", "#nav-favorites", function (evt) {
  hidePageComponents();
  $favoriteStoriesList.show();
  putFavoriteStoriesOnPage();
  $myStoriesList.empty();
  $("span").text("");
  $("h3").text("");
  $("#label-name").text(``);
  $("#label-username").text(``);
  $("#label-accountCreated").text(``);
  $storyForm.hide();
});

// when a user clicks 'my stories' in the nav bar, show list of stories submitted

$("nav").on("click", "#nav-myStories", function (evt) {
  hidePageComponents();
  $myStoriesList.show();
  putMyStoriesOnPage();
  $favoriteStoriesList.hide();
  $("p").text("");
  $storyForm.hide();
  $("h3").text("");
  $("#label-name").text(``);
  $("#label-username").text(``);
  $("#label-accountCreated").text(``);
});

// when a user clicks on username in the nav bar, show user profile information

$("nav").on("click", "#nav-user-profile", function (evt) {
  hidePageComponents();
  $favoriteStoriesList.hide();
  $storyForm.hide();
  $myStoriesList.hide();
  $("h3").text("User Profile Info");
  $("#label-name").text(`Name: ${currentUser.name}`);
  $("#label-username").text(`Username: ${currentUser.username}`);
  $("#label-accountCreated").text(`Account Created: ${currentUser.createdAt}`);
});
