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
  console.log(message)
  console.log(message.time)
  console.log(message.tabId)
})

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke === "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer === "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer === "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});