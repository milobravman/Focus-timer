const startTimer = document.getElementById('startTimer');

function getTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
      });
}

function getTime() {
    console.log("running get time...")
    let time = parseInt(document.getElementById('timer-input').value)
    if (Number.isSafeInteger(time)){
        sendTime(time)
    }
}

function sendTime(time) {
    chrome.runtime.sendMessage({
        message: time
    })
}


startTimer.addEventListener(
    'click',
    getTime
)

