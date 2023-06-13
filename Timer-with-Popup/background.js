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
    chrome.alarms.create('demo-default-alarm', {
      when: Date.now() + (time * 60_000),
    });
}
try {
  chrome.alarms.onAlarm.addListener(() => {
    if (tab_Id != undefined){
      console.log("alarm went off!!")
      console.log(tab_Id)
      chrome.tabs.sendMessage(tab_Id, "test")
    }else
    {
      console.log("getting key from storage API")
      chrome.storage.local.get(["key"]).then((result) => {
        console.log("the value of key is" + result.key)
        chrome.tabs.sendMessage(result.key, "test-from-the-backround")
      })
    }
  });  
} catch (error) {
  console.log(error)
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
  console.log("onMessageEvent fired")
  tab_Id = message.tabId
  if (tab_Id != undefined){
    chrome.storage.local.set({key: tab_Id}).then(() => {
      console.log("value is set")
    })
    makeAlarm(message.time)
    console.log(tab_Id)
    sendResponse("responce from brackround.js")
    chrome.scripting.executeScript({
      files:["/scripts/pageObserver.js"],
      target:{tabId: message.tabId}
    })
  }else{
    console.log("something when wrong")
  }
})