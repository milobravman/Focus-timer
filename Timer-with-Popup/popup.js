function getTab() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0]);
      });
}

const startTimer = document.getElementById('startTimer');

startTimer.addEventListener(
    'click',
    getTab
)

