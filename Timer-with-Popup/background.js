chrome.runtime.onStartup.addListener(() =>{
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.runtime.onInstalled.addListener(() =>{
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

let tab_Id

function makeAlarm(time) {
  let now = Date.now() + (time * 60_000)
  chrome.alarms.create('demo-default-alarm', {
    when: now,
  });
  chrome.storage.local.set({stop: now})
}
try {
  chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.local.get(["key"]).then((result) => {
      console.log("the value of key is" + result.key)
      chrome.tabs.sendMessage(result.key, "test-from-the-backround")
    })
  });  
} catch (error) {
  console.log(error)
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
  console.log(message)
  // this first case handles the making of a new timer
  if(message.tabId !=null){
    tab_Id = message.tabId
    chrome.storage.local.set({key: tab_Id}).then(() => {
      console.log("value is set")
    })
    makeAlarm(message.time)
    //console.log(tab_Id)
    sendResponse("responce from brackround.js")
    chrome.scripting.executeScript({
      files:["/scripts/pageObserver.js"],
      target:{tabId: message.tabId}
    })
  // this second case handles getting the current timer
  }else if (message === "the user failed"){
    console.log("inside the stoping the alarm case")
    chrome.alarms.clearAll()
    chrome.storage.local.set({stop: null})
  }else{
    chrome.storage.local.get(["stop"]).then((result) => {
      console.log(result.stop)
      sendResponse(result.stop)
    })
  }

})


// I probobly should at some point delete the servercie worker alarm if the user leaves the page