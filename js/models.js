"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {
  /** Make instance of Story from data object about story:
   *   - {storyId, title, author, url, username, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    try {
      const url = new URL(this.url);
      if (url.hostname.includes("www.")) {
        const www = "www.";
        const hostName = url.hostname.slice(www.length);
        return hostName;
      } else {
        const hostName = url.hostname;
        return hostName;
      }
    } catch (err) {
      console.error("url was entered incorrectly", err);
      return null;
    }
  }
}

// ******************************************************************************
//  * List of Story instances: used by UI to show story lists in DOM.
//  */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances (stories)
   *  - makes a single StoryList instance out of the array of Story instances and returns the StoryList instance
   *    (storyList)
   * */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method? It makes sense to have getStories be a static method (aka not an instance method) because
    //  all its doing is retrieving stories from the api— it doesn’t have anything to do with an existing instance
    //  of StoryList. It makes sense to have separate static methods like this so you can do simple operations like
    //  call an api any place in your code without needing to worry about an existing instance of StoryList to call
    // it on.

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });
    //  Build an array of Story instances and set it equal to "stories"
    // i.e. stories = [(17) [Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story]]
    // Story object = Story {storyId, title, author, url, username, createdAt}

    // response.data.stories = (17) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}] (not Story instances, just an array of objects of story data)
    // Each object in the 'response.data.stories' array has the format: {author, createdAt, storyId, title, updatedAt, url, username}

    // loops over every story in the array 'response.data.stories', makes a story instance of each story (new Story(story) and then adds that instance to a new 'stories' array ('.map()' returns a new array with each element being the result of the callback function.)
    const stories = response.data.stories.map((story) => new Story(story));

    //    OR
    // const stories = response.data.stories.map(function(story){
    //   return new Story(story)
    // })
    //     OR
    // let stories = [];
    // let arr = response.data.stories;
    // for(let i=0; i< arr.length; i++){
    //   stories.push(new Story(arr[i]) )
    // }
    // return new Story(story)

    // build an instance of the StoryList class using the new array 'stories' (an array of Story instances) and set it equal to storyList
    //i.e. storyList = StoryList {stories: (17) [Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story, Story]}
    // i.e. the first Story instance = 0: Story {storyId, title, author, url, username}

    let storyList = new StoryList(stories);
    return storyList;
  }

  /** Adds user submitted story data to API, makes a Story instance, adds it to story list.
   * - token: string of user token,
   * - newStory: object of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(token, newStory) {
    // Add story to API
    let response = await axios.post(`${BASE_URL}/stories`, {
      story: newStory,
      token: token,
    });

    // Make a story instance from data object about story
    const story = new Story(response.data.story);

    // Add new 'story' instance to storyList (single StoryList instance)
    storyList.stories.push(story);
    // Add new 'story' instance to currentUser.ownStories array
    currentUser.ownStories.push(story);
    return story;
  }

  // deletes a user submitted story
  static async deleteStory(token, storyId) {
    // Delete story from API
    let response = await axios.delete(`${BASE_URL}/stories/${storyId}`, {
      data: { token: token },
    });

    // loops over all the storyIds of the stories in storyList (story.storyId), filters out those that do not equal the storyId of the deleted story ('storyId') and returns the stories in storyList with id's ('story.storyId') that don't match the storyId of the deleted story ('storyId')
    storyList.stories = storyList.stories.filter(function (story) {
      return story.storyId !== storyId;
    });
    // loops over all the storyIds of the stories in currentUser.ownStories ('story.storyId'), filters out those  that do not equal the storyId of the deleted story ('storyId') and returns the stories in currentUser.ownStories with id's ('story.storyId') that don't match the storyId of the deleted story ('storyId')
    currentUser.ownStories = currentUser.ownStories.filter(function (story) {
      return story.storyId !== storyId;
    });
  }
}
/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    // loops over every story in the 'favorites' and 'ownStories' arrays, makes a story instance of each story (new Story(s) and then adds that instance to the new 'favorites' and 'ownStories' arrays ('.map()' returns a new array with each element being the result of the callback function.)
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  //  Determine if a particular star next to a story is full or empty, toggle it when clicked on and add or delete story from favorites
  static async toggleFavorite(star, storyId) {
    // if star is empty (class=far fa-star), we want to fill it in (change class to 'fas fa-star') and add the story to the favorites list. 'updatedUser is set equal to the object returned from the 'addFavoriteStory' method
    if (star.classList.contains("far")) {
      star.className = "fas fa-star";
      let updatedUser = await User.addFavoriteStory(
        currentUser.loginToken,
        currentUser.username,
        storyId
      );

      // refresh 'currentUser' to get updated 'favorites' and 'ownStories' arrays by setting it equal to  'updatedUser'

      // create a new instance object of User called 'currentUser' and assign all its properties to those of updatedUser (return of the API request in addFavoriteStory method)
      // additionally set the 'ownStories' property on the new 'currentUser' object equal to updatedUser.stories. 'updatedUser' doesn't have an 'ownStories' property, only a 'stories' property. The 'stories' property is an array of objects that include the data for all the user-added stories which is what the 'currentUser.ownStories' array should include

      // Same as:
      // currentUser = new User(
      //  {
      //    username: updatedUser.username,
      //    name: updatedUser.name,
      //    createdAt: updatedUser.createdAt,
      //    favorites : updatedUser.favorites ,
      //    ownStories : updatedUser.stories,
      // },
      // currentUser.loginToken
      // );

      currentUser = new User(
        { ...updatedUser, ownStories: updatedUser.stories },
        currentUser.loginToken
      );
    }
    // if star is filled in (class=fas fa-star), we want to empty it (change class to 'fas fa-star') and remove story from favorites list. 'updatedUser' is set equal to the object returned from the 'removeFavoriteStory' method
    else if (star.classList.contains("fas")) {
      star.className = "far fa-star";
      let updatedUser = await User.removeFavoriteStory(
        currentUser.loginToken,
        currentUser.username,
        storyId
      );

      // refresh 'currentUser' to get updated 'favorites' and 'ownStories' arrays by setting it equal to  'updatedUser'
      // create a new instance of User called 'currentUser' and assign all its properties to those of updatedUser
      // additionally set the the ownStories property on 'currentUser' to be equal to updatedUser.stories

      currentUser = new User(
        { ...updatedUser, ownStories: updatedUser.stories },
        currentUser.loginToken
      );
    }
    return currentUser.favorites;
  }

  /** Adds user favorite to API, adds it to favorite list.
   * - token: string of user token,
   * - username: string of username
   * - storyId: integer
   *
   * Returns the user object which includes favorites array
   */

  // Add favorite story to API and return user data: {createdAt, favorites: [{},{}...], name, stories:[{},{}...], updatedAt, username}
  static async addFavoriteStory(token, username, storyId) {
    let response = await axios.post(
      `${BASE_URL}/users/${username}/favorites/${storyId}`,
      {
        token: token,
      }
    );
    return response.data.user;
  }

  // Remove favorite story from API and return user data: {createdAt, favorites: [{},{}...], name, stories:[{},{}...], updatedAt, username}
  static async removeFavoriteStory(token, username, storyId) {
    let response = await axios.delete(
      `${BASE_URL}/users/${username}/favorites/${storyId}`,
      {
        data: { token: token },
      }
    );
    return response.data.user;
  }
}

// When click on a star, the star will either fill in if it's empty or empty if it's filled in
// 'storyId' is the id of the story that had its star clicked
$("ol").on("click", ".fa-star", function (evt) {
  const star = evt.target;
  const storyId = evt.target.parentElement.id;
  User.toggleFavorite(star, storyId);
});
// when click on the trashcan element next to one of the user submitted stories in 'my stories', delete that story from the overall stories list
// 'storyId' is the id of the story that had its trashcan clicked
$("ol").on("click", ".fa-trash-alt", async function (evt) {
  const trashCan = evt.target;
  const storyId = evt.target.parentElement.id;
  // delete the story from the API by calling the 'deleteStory' method
  // Make stories disappear from list without reloading page by calling putMyStoriesOnPage function
  await StoryList.deleteStory(currentUser.loginToken, storyId);
  putMyStoriesOnPage();
});
