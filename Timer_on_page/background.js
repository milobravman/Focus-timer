// since I was having trouble getting popup.js to add the functionality I wanted I remebered that focus Mode uses the service working which exacutes in the backround better than 'actions do'

// chrome docs led me to 'Common events' and that led me to the chrome.runtime API which is how diffrent parts of the extention can talk to one another.
//https://developer.chrome.com/docs/extensions/mv3/service_workers/events/

let total_seconds = 0;
let popupCounter;
let tabID;


// chrome.action.onClicked.addListener(tab =>{
//   console.log(tab);
// })

// chrome.runtime.onInstalled.addListener((tab) => {
//   console.log(tab);
// });


//  async function getCurrentTab() {
//   let queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   let tab = await chrome.tabs.query(queryOptions);
//   return tab;
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message === "get-counter-data"){
    sendResponse(total_seconds);
  }else{
    tabID = sender.id
    console.log(tabID)
    // chrome.scripting.executeScript({
    //   target : {tabId : tabID},
    //   files : [ "script.js" ],
    // }).then(() => console.log("script injected"));
    //let currentTab = getCurrentTab()
    //console.log("hi currentTab:"+currentTab);
    total_seconds = message.usertime
    popupCounter = setInterval(countDown, 1000)
  } 
  });

function countDown() {
        if (total_seconds === 1){
          clearInterval(popupCounter);
        }
        console.log(total_seconds);
        total_seconds--;
}