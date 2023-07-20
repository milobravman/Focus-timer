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

	// I should initialize what needs to be in local storage here
	const dateInstalled = new Date();
	chrome.storage.local.set({
		timerStarted: 0,
		timersCompleted: 0,
		timeFocused: 0,
		date: dateInstalled,
		dailyStreak: dateInstalled

	})
});

// Local storage looks like 

/*
{
	key: tabid
	stop: time for the alarm to fire (used for display)
	timerDefault: used to have the timer be what the user uses
	timeFocused: how log a user has Focused for
	timersStarted: how many times a user has started a timer
	timersCompleted: how many times a user has completed a timer
	date: date of install and could help me see when the local storage is cleared
	dailyStreak: the date of the last timer and if the next is within 24 hours and on a new day the user will see some kind of timer streak
}
*/


// holds the tab_ID this probably should be deleted at some point and the tab_ID should be full handled by the storage API
let tab_Id
let timerFinishes
let now
let lengthofTimer
// makes the alarm that controls the when use has finished focusing
// also stores the time when the user should stop in the storage API
// also monitors the tab and turns off the timer if they close the tab 
function makeAlarm(time) {
	let p = chrome.storage.local.get()
	console.log(p)

	//let timersStarted
	chrome.storage.local.get('timerStarted').then((r)=>{
		console.log(r.timerStarted)
		chrome.storage.local.set({timerStarted: r.timerStarted+1})
	})
	lengthofTimer = time
	now = Date.now()
	timerFinishes = Date.now() + (time * 60_000)
	
	chrome.alarms.create('demo-default-alarm', {
		when: timerFinishes,
	});
	chrome.storage.local.set({stop: timerFinishes})
}

// adds a listener for when the alarm goes off
// send data to other parts of the extension when it fires
try {
	chrome.alarms.onAlarm.addListener(() => {
		chrome.storage.local.get(["key"]).then((result) => {
			chrome.tabs.sendMessage(result.key, "test-from-the-background")
		})
		// console.log(time)
		console.log(timerFinishes-now)

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
		// not sure what these lines of code below do
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