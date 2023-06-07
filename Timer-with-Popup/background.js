let tabId; // this will hold the tab that needs to be focused on

chrome.runtime.

chrome.alarms.create('demo-default-alarm', {
  delayInMinutes: 1,
  periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("alarm went off!!")
  chrome.action.setIcon({
    path: getIconPath(alarm.name),
  });
});

