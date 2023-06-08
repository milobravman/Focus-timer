const startTimer = document.getElementById('startTimer');

function wrapper() {
    const getTab = new Promise((resolve, reject) => {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            let id = tabs[0].id
            //console.log(id)
            resolve(id)
          });
    })
    getTab.then((sm) => {
        getTime(sm)
    })    
}

function getTime(id) {    
    let time = parseInt(document.getElementById('timer-input').value)
    if (Number.isSafeInteger(time)){
        sendTime(time , id)
    }
    console.log(id)
    // I probobly should have an error message if the put in a fraction or a string
}


//send message doesn't run sometimes?
function sendTime(time, id) {
    console.log("sendTime is runing")
    const message = {}
    message.tabId = id
    message.time = time
    chrome.runtime.sendMessage(message)
}

function handleCLick() {
    wrapper()
}

startTimer.addEventListener(
    'click',
    handleCLick
)

