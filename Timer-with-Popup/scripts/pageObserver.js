//this script is responsable for making and firing audio that signifies if the user was succesful in staying focused or not.

// it also sets up a listenr for if the user is on the page for the durration of the timer and plays a sound signifying succsess.
try {
    let myAudioFail = new Audio(chrome.runtime.getURL("./audio/t-rex-roar.mp3")); //declaring the audio file out here fixes the first-time-pressed issue
    
    let myAudioPass = new Audio(chrome.runtime.getURL("./audio/yay-6120.mp3"));
    
    // if the user leaves the document they 
    document.addEventListener(
        'visibilitychange',
        handleVisblityChange
    )
    
    function handleVisblityChange() {
        myAudioFail.play()
        chrome.runtime.sendMessage("the user failed")
        document.removeEventListener("visibilitychange", handleVisblityChange);
    }
    
    chrome.runtime.onMessage.addListener((message) => {
        myAudioPass.play()
        document.removeEventListener("visibilitychange", handleVisblityChange);
    })
} catch (error) {
    console.log(error)
}