// Background.js is responsible for

// Icon management

// setting the alarm that controls the succuss case

// injecting the script into the tab the user wants to focus on


// these create icon text that signifies to user the timer has not been set
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

// holds the tab_ID this probably should be deleted at some point and the tab_ID should be full handled by the storage API
let tab_Id

// makes the alarm that controls the when use has finished focusing
// also stores the time when the user should stop in the storage API
// also monitors the tab and turns off the timer if they close the tab 
function makeAlarm(time) {
	let now = Date.now() + (time * 60_000)
	chrome.alarms.create('demo-default-alarm', {
		when: now,
	});
	chrome.storage.local.set({stop: now})
}

// adds a listener for when the alarm goes off
// send data to other parts of the extension when it fires
try {
	chrome.alarms.onAlarm.addListener(() => {
		chrome.storage.local.get(["key"]).then((result) => {
			//console.log("the value of key is" + result.key)
			chrome.tabs.sendMessage(result.key, "test-from-the-background")
		})
		chrome.action.setBadgeText({text: "OFF",});
	});  
} catch (error) {
	console.log(error)
}


// this function is in need of a rework for readability
// I have tab_Id .tabId and tabId and there are all different -.-
chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>{
	// this first case handles the making of a new timer
	if(message.tabId !=null){
		tab_Id = message.tabId
		chrome.storage.local.set({key: tab_Id})
		makeAlarm(message.time)
		sendResponse("response from background.js")
		chrome.scripting.executeScript({
			files:["/scripts/pageObserver.js"],
			target:{tabId: message.tabId}
		})
		chrome.action.setBadgeText({text: "ON",});
		chrome.tabs.onRemoved.addListener((tabId) => {
			if (tabId == tab_Id){
				console.log("holy shit the tab was closed")
			}
		})

	// this second case handles getting the turning of the timer if the user fails
	}else if (message === "the user failed"){
		console.log("inside the stopping the alarm case")
		chrome.alarms.clearAll()
		chrome.storage.local.set({stop: null})
		chrome.action.setBadgeText({text: "OFF",});
	// this last case handles sending data to popup.js for the real time timer
	}else{
		chrome.storage.local.get(["stop"]).then((result) => {
			console.log(result.stop)
			sendResponse(result.stop)
		})
	}
})