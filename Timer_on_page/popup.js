// This file has the JS needed to run a timer in the extension window.
// The problem is is runs only when the extention window is open
// I belive the reader tutorial may cover how to run the JS without the window being open.


// looking at reatingTime the manifest.json is diffrent using scripts instead of an action. 


let total_mins = 0;
let total_seconds = 0;
let popupCounter;
const time_input = document.getElementById('getTime');

document.addEventListener("DOMContentLoaded", () => {
    checkForExistingCounter();
})


function checkForExistingCounter() {
    chrome.runtime.sendMessage('get-counter-data', (response) => {
        // 3. Got an asynchronous response with the data from the service worker
        //console.log('received user data', response);
        if (response > 0){
            total_seconds = response;
            popupCounter = setInterval(countDown, 1000)
        }
      });
}

time_input.addEventListener(
    'click',
    setTime
);


function setTime() {
    let timeMins = document.getElementById('time_to_set').value;
    total_mins = timeMins;
    total_seconds = timeMins*60;
    let hours = Math.floor(timeMins / 60); // get total hours
    let mins = Math.floor(total_seconds / 60);;
    let currentTime = hours + ':' + mins + ':' + 0;
    document.getElementById("clock").innerHTML = currentTime;
    popupCounter = setInterval(countDown, 1000)
    backroundCountDown()
    alertTimeDone()
}

// function popupCounter() { 
//     setInterval(countDown(), 1000);
// }
function countDown() {
    if (total_seconds === 1){
        clearInterval(popupCounter);
        //alertTimeDone();
    }
    //console.log(total_seconds);
    total_seconds--;
    let seconds = total_seconds % 60
    let mins = Math.floor(total_seconds / 60)
    let hours = Math.floor(total_mins / 60); // get total hours
    let currentTime = hours + ':' + mins + ':' + seconds;
    document.getElementById("clock").innerHTML = currentTime;
}

function alertTimeDone() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tab = chrome.tabs.query(queryOptions);
    console.log(tab)
}


function backroundCountDown() {
    chrome.runtime.sendMessage(
        {
            usertime: total_seconds
        }
    )
}

let temp = {
    message: {
        usertime: total_seconds
    }
}