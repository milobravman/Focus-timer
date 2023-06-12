// this onCliicked listener needs icons for reasons I do not unerstand
let timersClicked = 0
chrome.action.onClicked.addListener((tab) =>{
    console.log(timersClicked)
    // if (timersClicked > 0){
    //     console.log("about to send a message!")
    //     chrome.runtime.sendMessage(
    //         {
    //             reset: "yes"
    //         }
    //     )
    // }
    chrome.scripting.executeScript({
        files:["focus-timer.js"],
        target:{tabId: tab.id},
    })
    timersClicked++;
})

chrome.runtime.onMessage.addListener((message,sender, sendResponse) =>{
    sendResponse(timersClicked);
    //console.log("this is the message!" + message.reset)
  })


  // huh?
