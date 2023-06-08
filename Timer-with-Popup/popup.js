const startTimer = document.getElementById('startTimer');


// function getTab() {
//     let id;
//     console.log ("getTab firing")
//     chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//         //console.log(tabs[0]);
//         //console.log(tabs)
//         //console.log(tabs[0])
//         id = tabs[0].id
//         console.log(id)
//       });
//     return id
// }


function wrapper() {
    const getTab = new Promise((resolve, reject) => {
        let id;
        console.log ("getTab firing")
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            //console.log(tabs[0]);
            //console.log(tabs)
            //console.log(tabs[0])
            id = tabs[0].id
            console.log(id)
            resolve(id)
          });
    })
    getTab.then((sm) => {
        console.log("did the id load" + sm)
        getTime(sm)
    })    
}




function getTime(id) {
    
    console.log("running getTime...")
    let time = parseInt(document.getElementById('timer-input').value)
    //let id = getTab()
    console.log("inside get time"+id)
    if (Number.isSafeInteger(time)){
        sendTime(time , id)
    }
}

function sendTime(time, id) {

    const message = {}
    message.tabId = id
    message.time = time
    console.log(message)

    chrome.runtime.sendMessage(message)
}

function handleCLick() {
    //console.log("js is so weird")
    wrapper()
}

startTimer.addEventListener(
    'click',
    handleCLick
)

