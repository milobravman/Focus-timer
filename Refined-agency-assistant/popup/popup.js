/* Popup.js 
handles the functionality of the popup page which includes
Setting a timer
*/

checkAccessiblePage() //checks if that is not a //:chrome page
checkExisting() // checks if a timer exists, slight UI lag I don't know how to fix
checkDefaultTimer()
const StartTimer = document.getElementById('startTimer')
const TimerInput = document.getElementById('timer-input')
const MinsLabel = document.getElementById('mins-label')
const InputLabel = document.getElementById('timer-input-label')
const TimerBodyContainer = document.getElementById('timer-body-container')

let UserDefault = 10;

TimerInput.addEventListener(
    "input",
    trackDefault
    )

function trackDefault(e) {
    console.log(e.target.value.length)
    if(e.target.value.length > 3){
        TimerInput.value = e.target.value.slice(0,3); 
    }
    chrome.storage.local.set({timerDefault: parseInt(e.target.value)})
}

function checkDefaultTimer() {
    chrome.storage.local.get("timerDefault").then((result) =>{
        console.log(typeof(result.timerDefault))
        console.log(Number.isSafeInteger(result.timerDefault))
        if (Number.isSafeInteger(result.timerDefault)) {
            console.log("if statement firing")
            TimerInput.value = result.timerDefault
        }
    })
}

// begins a sequence of functions that 
// taking in user input
// run some verifications
// send data to other parts of the extension
// create a real time counter
StartTimer.addEventListener(
    'click',
    wrapper
    )

// check accessible url. this will check to see if this is a sight that the extension can access and block any features if not
function checkAccessiblePage () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].url === undefined){
            document.getElementById('main-body').innerHTML="Not available on this page"
            //const notAvailable = document.createElement("span")
            //notAvailable.innerHTML ="Not available on this page"
            //let title = document.getElementsByTagName('div')
            //document.body.insertBefore(notAvailable, title[0])
        } 
      });
}

// gets the current open tab
function wrapper() {
    TimerInput.style.display = "none"
    StartTimer.style.display = "none"
    MinsLabel.style.display = "none"
    InputLabel.style.display = "none"
    TimerBodyContainer.style.textAlign = "center"
    const getTab = new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            console.log("hi")
            console.log(tabs[0].url)
            let id = tabs[0].id
            resolve(id)
          });
    })
    getTab.then((sm) => {
        getTime(sm)
    })    
}

// checks local storage to see if alarm exist
// this way users can see the timer in real time if they wish
function checkExisting() {
    chrome.storage.local.get(["stop"]).then((result) => {
        if (Number.isSafeInteger(result.stop))// this is checks if a alarm exists
        {  
            let timeLeft = result.stop - Date.now() // because date is tract in ms the current date is always smaller than a future date until 2038 
            if (timeLeft > 0) {
                TimerInput.style.display = "none"
                StartTimer.style.display = "none"
                MinsLabel.style.display = "none"
                InputLabel.style.display = "none"
                TimerBodyContainer.style.textAlign = "center"
                timeWrapper(timeLeft/60_000)
            }
        }
    })
}

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
        countDown.innerHTML = p_time
    }
}

// gets the user inputted value 
function getTime(id) {    
    let time = parseInt(document.getElementById('timer-input').value)
    if (Number.isSafeInteger(time)){
        sendTime(time , id)
    }
}

// sends the TabID and the time in minutes to the background.js
function sendTime(time, id) {
    const message = {}
    message.tabId = id
    message.time = time
    const sending = chrome.runtime.sendMessage(message)
    sending
    timeWrapper(time)
}