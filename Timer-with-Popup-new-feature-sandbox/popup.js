// Popup.js is responsible for 

// talking in user input and sending it to the background.js

// having a realtime counter that is close to what the alarm is set for

// getting an alarm info if one has already been set


document.getElementById('block-button').addEventListener('click', handlePageBlock)

function handlePageBlock() {
    console.log("handle-block Online!!")
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        // console.log(tabs[0])
        // console.log(tabs[0].url)

        let newRule = {};
        chrome.declarativeNetRequest.getDynamicRules().then((res) =>{
            console.log(res)
            newRule.id = res.length+1
            newRule.priority = 1
            newRule.action = {"type": "block"}
            newRule.condition = {
                "urlFilter": tabs[0].url,
                "resourceTypes": ["main_frame"]
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[newRule]
            })
        })
      });
    // get the active tab and get the url
    // then add it to the dynamic rules
    // then refresh or redirect form the page
}

// check accessible url. this will check to see if this is a sight that the extension can access and block any features if not
function checkAccessiblePage () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].url === undefined){
            console.log("extension not available on this page")
            let page = document.getElementsByTagName('div')
            for (let i = 0; i< page.length; i++) {
                page[i].innerHTML=""
            }
            const notAvailable = document.createElement("span")
            notAvailable.innerHTML ="Not available on this page"
            let title = document.getElementsByTagName('div')
            document.body.insertBefore(notAvailable, title[0])
        } 
      });
}

checkAccessiblePage()


const startTimer = document.getElementById('startTimer');
startTimer.addEventListener(
    'click',
    handleCLick
    )
    // begins a sequence of functions that 
    // taking in user input
    // run some verifications
    // send data to other parts of the extension
    // create a real time counter
function handleCLick() {
    wrapper()
    document.getElementById("timer-input").style.display = "none";
    document.getElementById("startTimer").style.display = "none";
}
    


const goToPageTwo = document.getElementById('page-2-button')
    
goToPageTwo.addEventListener(
    'click',
    makePage2Visible
)

function makePage2Visible() {

    let pageOneElements = document.getElementsByClassName("page-1")
    for (let i = 0; i< pageOneElements.length; i++) {
        pageOneElements[i].style.display="none";
    }
    
    let pageTwoElements = document.getElementsByClassName("page-2")
    for (let i = 0; i< pageTwoElements.length; i++) {
        pageTwoElements[i].style.display="inline";
    }

}

const goToPageOne = document.getElementById("page-1-button")
goToPageOne.addEventListener(
    'click',
    makePage1Visible
)

function makePage1Visible() {
    let pageOneElements = document.getElementsByClassName("page-1")
    for (let i = 0; i< pageOneElements.length; i++) {
        pageOneElements[i].style.display="inline";
    }
    
    let pageTwoElements = document.getElementsByClassName("page-2")
    for (let i = 0; i< pageTwoElements.length; i++) {
        pageTwoElements[i].style.display="none";
    }
}
        
checkExisting()

function checkExisting() {
    chrome.storage.local.get(["stop"]).then((result) => {
        if (Number.isSafeInteger(result.stop))// this is checks if a alarm exists
        {  
            let timeLeft = result.stop - Date.now()
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
    console.log("wrapper firing")
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
