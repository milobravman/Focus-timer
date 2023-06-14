const startTimer = document.getElementById('startTimer');

checkExisting()

function checkExisting() {
    // const sending = chrome.runtime.sendMessage("any existing alarms?")
    // sending.then((res) => {console.log(res)})
    chrome.storage.local.get(["stop"]).then((result) => {
        //console.log(result.stop)
        //console.log(Number.isSafeInteger(result.stop))
        if (Number.isSafeInteger(result.stop))// this is checks if a alarm exists
        {  
            let timeLeft = result.stop - Date.now()
            console.log("TimeLeft!"+timeLeft)
            if (timeLeft > 0) {
                document.getElementById("timer-input").style.display = "none";
                timeWrapper(timeLeft/60_000)
            }
        }
    })
}

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

function getTime(id) {    
    let time = parseInt(document.getElementById('timer-input').value)
    if (Number.isSafeInteger(time)){
        sendTime(time , id)
    }
    console.log(id)
}


//send message doesn't run sometimes?
function sendTime(time, id) {
    console.log("sendTime is runing")
    const message = {}
    message.tabId = id
    message.time = time
    console.log(message)
    const sending = chrome.runtime.sendMessage(message)
    sending.then(handleRes)
    timeWrapper(time)
}

function handleRes(res) {
    console.log(res)
}

function handleCLick() {
    wrapper()
    document.getElementById("timer-input").style.display = "none";
}

startTimer.addEventListener(
    'click',
    handleCLick
)

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
        let mins = Math.floor(total_sec/60)

        if (mins === 0) {
            mins = "00"
        }

        if (mins < 10 && mins > 0){
            mins = '0'+mins 
        }

        let sec = total_sec%60

        if (sec === 0) {
            sec = "00"
        }

        if (sec < 10 && sec > 0){
            sec = '0'+sec 
        }

        let p_time = "00:" + mins+ ":" + sec
        console.log(p_time)
        countDown.innerHTML = p_time
    }
}