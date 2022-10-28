"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  // clears 'ol' of any previous stories
  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    // $story is the li and $story.children contains starClass, story-link, story-hostname, story-author, story-user
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}
// adds story to storyList, hides story form and storyList is refreshed
async function submitStories() {
  let storyNew = {
    author: $("#author").val(),
    title: $("#title").val(),
    url: $("#url").val(),
  };
  let token = currentUser.loginToken;

  await storyList.addStory(token, storyNew);
  $storyForm.hide();
  await getAndShowStoriesOnStart();
}
// when 'submit' button in story form is clicked, story is submitted and now shows on the page
$storyFormButton.on("click", submitStories);

//

// **
//  * A render method to render HTML for an individual Story instance
//  * - story: an instance of Story
//  *
//  * Returns the markup for the story.
//  */
function generateStoryMarkup(story, isMyStoriesPage = false) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  // set starClass to 'fas' (filled star) if story is in favorites or 'far' if not (empty star)
  // add trashcan element to 'li' only when on 'my stories' page ('isMyStoriesPage = true)
  const starClass = isStoryInFavorites(story) ? "fas" : "far";
  return $(`
      <li id="${story.storyId}">
        ${isMyStoriesPage ? `<i class="fas fa-trash-alt"></i>` : ""}
        ${
          currentUser != undefined
            ? `<i class="${starClass} fa-star" ></i>`
            : ""
        }
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Looks to see if story is in favorites array (currentUser.favorites), generates their HTML, and puts on page. */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");
  // clears array of any previous favorites
  $favoriteStoriesList.empty();
  // loop through all of the favorite stories and generate HTML for them
  for (let favorite of currentUser.favorites) {
    // $favorite is one of the favorite stories in the currentUser.favorites array
    const $favorite = generateStoryMarkup(favorite);

    $favoriteStoriesList.append($favorite);
  }

  $favoriteStoriesList.show();
}

// Returns true or false depending on if story is/isn't in favorites array and if user is/isn't logged in
// To be used to set the class of the star, either empty or filled, in the generateStoryMarkup function
function isStoryInFavorites(story) {
  if (!currentUser) {
    return false;
  }
  for (let favorite of currentUser.favorites) {
    if (story.storyId === favorite.storyId) {
      return true;
    }
  }
  return false;
}

/** Looks to see if story is in 'ownStory' array (currentUser.ownStory), generates the HTML, and puts on page. */
function putMyStoriesOnPage() {
  console.debug("putMyStoriesOnPage");
  // clears array of any previous user submitted stories
  $myStoriesList.empty();
  // loop through all of the user submitted stories and generate HTML for them
  for (let myStory of currentUser.ownStories) {
    // $myStory is one of the user submitted stories in the currentUser.ownStories array with a trashcan element added to its 'li'
    // When 2nd argument of the 'generateStoryMarkup' function ('isMyStoriesPage' - a boolean value) is set to true, the trashcan elements will be added next to each of the stories submitted when the 'generateStoryMarkup' is executed. It will ONLY be set to true when 'putMyStoriesOnPage' function is called when 'my stories' is clicked in the nav bar. Any other time, the 2nd argument 'isMyStoriesPage' is false and the trashcan elements will not be added whenever 'generateStoryMarkup' function is called.

    const $myStory = generateStoryMarkup(myStory, true);

    $myStoriesList.append($myStory);
  }

  $myStoriesList.show();
}
