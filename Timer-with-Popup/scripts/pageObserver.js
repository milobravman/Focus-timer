//this script is responsable for making and firing audio that signifies if the user was succesful in staying focused or not.
try {
    console.log("script is online!!!!")
    
    let myAudioFail = new Audio(chrome.runtime.getURL("./audio/t-rex-roar.mp3")); //declaring the audio file out here fixes the first-time-pressed issue
    
    let myAudioPass = new Audio(chrome.runtime.getURL("./audio/yay-6120.mp3"));
    
    // if the user leaves the document they 
    document.addEventListener(
        'visibilitychange',
        handleVisblityChange
    )
    
    function handleVisblityChange() {
        myAudioFail.play()
        document.removeEventListener("visibilitychange", handleVisblityChange);
    }
    
    // let port = chrome.runtime.connect({name: "knockknock"});
    // port.postMessage({joke: "portOpened"});
    // port.onMessage.addListener(function(msg) {
    //   if (msg.question === "timer-is-done"){
    //       port.postMessage({answer: "awesome"});
    //       myAudioPass.play()
    //       document.removeEventListener("visibilitychange", handleVisblityChange);
    //   }
    //   else if (msg.question === "Madame who?")
    //     port.postMessage({answer: "Madame... Bovary"});
    // });
    
    chrome.runtime.onMessage.addListener((message) => {
        myAudioPass.play()
        console.log(message)
    })
} catch (error) {
    
}