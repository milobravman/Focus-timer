chrome.runtime.onStartup.addListener(() =>{
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

let tab_Id

function makeAlarm(time) {
    chrome.alarms.create('demo-default-alarm', {
      when: Date.now() + time,
    });
}
try {
  chrome.alarms.onAlarm.addListener(() => {
    console.log("alarm went off!!")
    console.log(tab_Id)
    chrome.tabs.sendMessage(tab_Id, "test")
  });  
} catch (error) {
  console.log(error)
}
chrome.runtime.onMessage.addListener((message) =>{
  console.log("onMessageEvent fired")
  makeAlarm(message.time)
  tab_Id = message.tabId
  chrome.scripting.executeScript({
    files:["/scripts/pageObserver.js"],
    target:{tabId: message.tabId}
  })
})

// chrome.runtime.onConnect.addListener(function(port) {
//   console.assert(port.name === "knockknock");
//   port.onMessage.addListener(function(msg) {
//     if (msg.joke === "portOpened")
//       port.postMessage({question: "timer-is-done"});
//   });
// });