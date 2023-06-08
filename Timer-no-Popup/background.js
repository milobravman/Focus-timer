// this onClicked listener needs icons for reasons I do not understand
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

let timersClicked = 0

chrome.action.onClicked.addListener((tab) =>{
    //console.log(timersClicked)
    chrome.action.setBadgeText({
        tabId: tab.id,
        text: "ON",
      });
    chrome.scripting.executeScript({
        files:["focus-timer.js"],
        target:{tabId: tab.id},
    })
    timersClicked++;
    chrome.runtime.onMessage.addListener((message,sender, sendResponse) =>{
        console.log(message)
        chrome.action.setBadgeText({
            tabId: tab.id,
            text: "OFF",
          });
        //sendResponse(timersClicked);
      })
})