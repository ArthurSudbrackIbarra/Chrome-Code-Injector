/*
  [Content Script]

  This is the content script of the extension.
  It runs in the context of the page and can access the DOM.

  From StackOverflow:

  "Content scripts are JavaScript files that run in the context
  of web pages. By using the standard Document Object Model (DOM),
  they can read details of the web pages the browser visits, or
  make changes to them."

  Link: https://stackoverflow.com/questions/12971869/background-scripts-vs-content-scripts-in-chrome-extensions
*/

/*
  Let's say you want to add a listener for when the user presses the "a" + "ctrl" key.
  You can do that like this:
*/
window.addEventListener("keyup", (event) => {
  if (event.ctrlKey && event.key === "a") {
    alert("You pressed the ctrl + a key combination!");
  }
});

export {};

/*
  Delete this file if you don't plan on using a content script.
*/
