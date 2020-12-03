/*  This file will be the clientside javascript that will run in the browser
    To make the HTTP requests from clientside javascript, we'll use the fetch api.
    Fetch is generally used on clientside/frontend because fetch is not part of javascript. It is a browser-based api. 
    So, we can use it in all browsers, but it is not accessible in nodejs.
    With the request function in nodejs, we passed a callback as the second argument. 
    With the fetch api, we use the .then method on the return value from fetch and we provide to it the callback function. */

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1') //we use # instead of . because # is for id and . is for class
const messageTwo = document.querySelector('#message-2');

//It's common to see the event callback simply called e instead of event
weatherForm.addEventListener('submit', (event) => {
    //event.preventDefault() is going to prevent the browser from refreshing the page so we can let the function run
    event.preventDefault();
    const searchedLocation = search.value;

    messageOne.textContent = "Loading...";
    messageTwo.textContent = "";

    //Fetch data from this url and then run this function
    fetch('/weather?address=' +searchedLocation).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error;
            } else {
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;
            }
        });
    });
});