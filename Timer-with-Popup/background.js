let tabId; // this will hold the tab that needs to be focused on

//chrome.runtime.
function makeAlarm(time) {
    chrome.alarms.create('demo-default-alarm', {
      delayInMinutes: time,
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("alarm went off!!")

});

chrome.runtime.onMessage.addListener((message) =>{
    makeAlarm(message.message)
})