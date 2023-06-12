const startTimer = document.getElementById('startTimer');

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

    let total_sec = time * 60

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


