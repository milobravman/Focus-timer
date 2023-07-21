// Background.js is responsible for

// Icon management

// setting the alarm that controls the succuss case

// injecting the script into the tab the user wants to focus on

// Tracking user data, not for data analytics but to try to make the experience more satisfying 


// these create icon text that signifies to user the timer has not been set
chrome.runtime.onStartup.addListener(() =>{
	chrome.action.setBadgeText({
		text: "OFF",
	});

	// check if the streak if dead
});

chrome.runtime.onInstalled.addListener(() =>{
	chrome.action.setBadgeText({
		text: "OFF",
	});

	// I should initialize what needs to be in local storage here
	const dateInstalled = Date.now();
	console.log(dateInstalled)
	chrome.storage.local.set({
		timerStarted: 0,
		timersCompleted: 0,
		timeFocused: 0,
		date: dateInstalled, // without the toString the object is not stored properly
		dailyStreak: 0,
		SignTimerUsed: 0 // this time determines the beginning of the 24 hour 'day' that the timer is a streak for further explication below  

	})
});

// holds the tab_ID this probably should be deleted at some point and the tab_ID should be full handled by the storage API
let tab_Id
let timerFinishes
let now
let lengthofTimer
// makes the alarm that controls the when use has finished focusing
// also stores the time when the user should stop in the storage API
// also monitors the tab and turns off the timer if they close the tab 
function makeAlarm(time) {
	// start section that tracks user data 
	chrome.storage.local.get().then((r)=>{
		console.log(r)
		if (r.dailyStreak === 0){
			console.log("setting daily streak to 1")
			chrome.storage.local.set({
				dailyStreak: 1,
				SignpostTimerUsed: Date.now()
			})
		}else{

		}
		chrome.storage.local.set({timerStarted: r.timerStarted+1})
	})



	// start section that sets the timer using chrome alarms
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

// How I'm implementing my streak logic
/*

I want to be able to implement timer streaks, where the user is encouraged to set at least 1 timer every 24 hours.

The implantation requires a 'signPost' timer that represent the start of a streak. The tricky part is for the streak to continue the user must set a timer 24-48 from the signpost timer. when this happens that new timer become the new signpost timer, and the steak increases.

additionally the user can set any of timers 0-23 hours after the signpost timer and it does not count as a streak but DOES NOT CHANGE THE SIGNPOST.

*/