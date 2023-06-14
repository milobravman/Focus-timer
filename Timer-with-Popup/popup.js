// Popup.js is resonsible for 

// talking in user input and sending it to the backround.js

// having a realtime counter that is close to what the alarm is set for

// getting an alram info if one has already been set


const startTimer = document.getElementById('startTimer');

checkExisting()

function checkExisting() {
    chrome.storage.local.get(["stop"]).then((result) => {
        if (Number.isSafeInteger(result.stop))// this is checks if a alarm exists
        {  
            let timeLeft = result.stop - Date.now()
            console.log("TimeLeft!"+timeLeft)
            if (timeLeft > 0) {
                document.getElementById("timer-input").style.display = "none";
                document.getElementById("startTimer").style.display = "none";
                timeWrapper(timeLeft/60_000)
            }
        }
    })
}


// gets the current open tab
function wrapper() {
    const getTab = new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let id = tabs[0].id
            resolve(id)
          });
    })
    getTab.then((sm) => {
        getTime(sm)
    })    
}

// gets the user inputed value 
function getTime(id) {    
    let time = parseInt(document.getElementById('timer-input').value)
    if (Number.isSafeInteger(time)){
        sendTime(time , id)
    }
}

// sends the TabID and the time in minutes to the backround.js
function sendTime(time, id) {
    console.log("sendTime is runing")
    const message = {}
    message.tabId = id
    message.time = time
    console.log(message)
    const sending = chrome.runtime.sendMessage(message)
    sending
    timeWrapper(time)
}

// begins a sequence of functions that 
// taking in user input
// run some verfications
// send data to other parts of the extetnion
// create a real time counter
function handleCLick() {
    wrapper()
    document.getElementById("timer-input").style.display = "none";
    document.getElementById("startTimer").style.display = "none";
}

startTimer.addEventListener(
    'click',
    handleCLick
)


// creates a realtime counter that shows up in popup.html
function timeWrapper(time) {
    let dummyTimer = setInterval(dumTimer, 1000)
    let countDown = document.getElementById("count-down")
    countDown.style.display = "inline"
    setTimeout(() => {
        console.log("clear interval should fire")
        clearInterval(dummyTimer)
    }, (time)* 60_000);

    let total_sec = Math.floor(time * 60)

    function dumTimer() {
        total_sec -=1
        let hours = Math.floor(total_sec/(60*60))
        let mins = Math.floor(total_sec/60)%60
        let sec = total_sec%60

        if (hours === 0) {
            hours = "00"
        }

        if (hours < 10 && hours > 0){
            hours = '0'+hours 
        }

        if (mins === 0) {
            mins = "00"
        }

        if (mins < 10 && mins > 0){
            mins = '0'+mins 
        }


        if (sec === 0) {
            sec = "00"
        }

        if (sec < 10 && sec > 0){
            sec = '0'+sec 
        }

        let p_time = hours + ":" + mins+ ":" + sec
        console.log(p_time)
        countDown.innerHTML = p_time
    }
}