/* Popup.js 
handles the functionality of the popup page which includes
Setting a timer
Changing pages
Blocking websites
*/

document.getElementById('to-options-page').addEventListener('click', handleOptions)

document.getElementById('edit').addEventListener('click', handleOptions)

document.getElementById('block-button').addEventListener('click', handlePageBlock)

document.getElementById('feedback').addEventListener('click', handleFeedbackForm)

// const startTimer = document.getElementById('startTimer');
// const goToPageTwo = document.getElementById('page-2-button')
// const goToPageOne = document.getElementById("page-1-button")

// begins a sequence of functions that 
// taking in user input
// run some verifications
// send data to other parts of the extension
// create a real time counter
// startTimer.addEventListener(
//     'click',
//     wrapper
//     )


// goToPageTwo.addEventListener(
//     'click',
//     makePage2Visible
//     )

// goToPageOne.addEventListener(
//     'click',
//     makePage1Visible
//     )


checkAccessiblePage()
// checkExisting()

// creates a new tab at the to the feedback form

function handleFeedbackForm() {
    chrome.tabs.create({
        url: "https://docs.google.com/forms/d/e/1FAIpQLSfEWG97aDzOPonfq2UMo6U54CojLpJplMDLpvYRmO5_ZR38tQ/viewform?usp=sf_link"
    })
}

// creates a new tab at the options.html
function handleOptions() {
    chrome.tabs.create({
        url: "/options/options.html"
    })
}
    
// get the active tab and get the url
// then add it to the dynamic rules
// then refresh or redirect form the page
function handlePageBlock() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        //console.log(tabs[0].id)
        let newRule = {};
        chrome.declarativeNetRequest.getDynamicRules().then((res) =>{
            //console.log(res)
            let urlParts = new URL(tabs[0].url)
            let newID = 0
            res.forEach((rule) => {
                newID = newID + rule.id
            })
            newRule.id = newID+1
            newRule.priority = 1
            newRule.action = {
                "type": "redirect",
                "redirect": {
                  "extensionPath": "/blocked-page/index.html"
                }
              }
            newRule.condition = {
                "urlFilter": urlParts.origin,
                "resourceTypes": ["main_frame"]
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[newRule]
            }).then((res) =>
                {
                    if (tabs[0].id !=undefined){
                        console.log("the tabid is "+tabs[0].id)
                        chrome.scripting.executeScript({
                            files:["/scripts/refresh.js"],
                            target:{tabId: tabs[0].id}
                          })
                    }
                }
            )
        })
      });
}

// check accessible url. this will check to see if this is a sight that the extension can access and block any features if not
function checkAccessiblePage () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs[0].url === undefined){
            // let page = document.getElementsByTagName('div')
            // for (let i = 0; i< page.length; i++) {
            //     page[i].innerHTML=""
            // }
            // const notAvailable = document.createElement("span")
            // notAvailable.innerHTML ="Not available on this page"
            // let title = document.getElementsByTagName('div')
            // document.body.insertBefore(notAvailable, title[0])
            document.getElementById('block-button').disabled=true
        } 
      });
}

//html style swapping
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

//html style swapping
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


// gets the current open tab
function wrapper() {
    document.getElementById("timer-input").style.display = "none";
    document.getElementById("startTimer").style.display = "none";
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
// function checkExisting() {
//     chrome.storage.local.get(["stop"]).then((result) => {
//         if (Number.isSafeInteger(result.stop))// this is checks if a alarm exists
//         {  
//             let timeLeft = result.stop - Date.now() // because date is tract in ms the current date is always smaller than a future date until 2038 
//             if (timeLeft > 0) {
//                 document.getElementById("timer-input").style.display = "none";
//                 document.getElementById("startTimer").style.display = "none";
//                 timeWrapper(timeLeft/60_000)
//             }
//         }
//     })
// }

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