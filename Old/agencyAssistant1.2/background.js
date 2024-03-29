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
	chrome.storage.sync.set({
		timersStarted: 0,
		timersCompleted: 0,
		timeFocused: 0,
		date: dateInstalled, // without the toString the object is not stored properly
		dailyStreak: 0,
		SignpostTimer: 0 // this time determines the beginning of the 24 hour 'day' that the timer is a streak for further explication below  

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
	chrome.storage.sync.get().then((r)=>{
		console.log(r)
		if (r.dailyStreak === 0){
			console.log("setting daily streak to 1")
			chrome.storage.sync.set({
				dailyStreak: 1,
				SignpostTimer: Date.now()
			})
		}else{
			// if the daily streak exists check if the range is 0-23 or 24-48, if its beyond 48 it should already have been cleared
			const DayinMili = 1000 * 60 * 60 * 24 // holy fuck I suck at units this is 24 mins not a day
			const five = 1000*60*5 // 5 minutes
			let timeSinceSignpostSet= Date.now()-r.SignpostTimer
			//console.log(DayinMili) 
			console.log(timeSinceSignpostSet)
			if (DayinMili < timeSinceSignpostSet && timeSinceSignpostSet< 2*DayinMili){
				chrome.storage.sync.set({
					dailyStreak: r.dailyStreak+1,
					SignpostTimer: Date.now()
				})

			} // if a streak exists and the user starts a timer within the rage

			if (timeSinceSignpostSet > 2*DayinMili){
				chrome.storage.sync.set({
					dailyStreak: 1,
					SignpostTimer: Date.now()
				})
			}

		}
		chrome.storage.sync.set({timersStarted: r.timersStarted+1})
	})



	// start section that sets the timer using chrome alarms
	lengthofTimer = time
	now = Date.now()
	timerFinishes = Date.now() + (time * 60_000)
	
	chrome.alarms.create('demo-default-alarm', {
		when: timerFinishes,
	});
	chrome.storage.local.set({stop: timerFinishes}) // this makes sence a local because having this be synced could bug
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
	console.log("printing 'message.tabId'"+message.tabId+"if its defined and i clicked off the tab this is the source of a bug")
	// this first case handles the making of a new timer
	// this could be refactored into a switch statement. but first I would need to fix the message sent to not need 'message.tabId' and just be 'message != null'
	if(message.tabId !=null){
		tab_Id = message.tabId // id of the page with the timer
		chrome.storage.local.set({key: tab_Id})
		makeAlarm(message.time)
		sendResponse("response from background.js")
		chrome.scripting.executeScript({
			files:["/scripts/pageObserver.js"],
			target:{tabId: message.tabId}
		})
		try {
			chrome.action.setBadgeText({text: "ON",}); //somehow this is throwing an error sometimes, hard to believe that this is the root cause
		} catch (error) {
			
		}
		// not sure what these lines of code below do
		chrome.tabs.onRemoved.addListener((tabId) => {
			if (tabId == tab_Id){
				console.log("holy shit the tab was closed")
			}
		})
		
	// this second case handles getting the turning of the timer if the user fails
	}else{ // the user failed
		console.log("inside the stopping the alarm case")  
		chrome.alarms.clearAll()
		chrome.storage.local.set({stop: null})
		chrome.action.setBadgeText({text: "OFF",})

	// this last case handles sending data to popup.js for the real time timer
	// this else statement is a relic now. I changed the way of doing this to have popup.js check local storage directly.
	// So this can be refactored and deleted 7/23/2023 
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