//this script is responsible for making and firing audio that signifies if the user was successful in staying focused or not.

// it also sets up a listener for if the user is on the page for the duration of the timer and plays a sound signifying success.
try {
    let myAudioFail = new Audio(chrome.runtime.getURL("./audio/t-rex-roar.mp3")); //declaring the audio file out here fixes the first-time-pressed issue
    
    let myAudioPass = new Audio(chrome.runtime.getURL("./audio/yay-6120.mp3"));
    
    // if the user leaves the document they 
    document.addEventListener(
        'visibilitychange',
        handleVisblityChange
    )

    window.addEventListener(
        'beforeunload',
         warnUser
         );

    function warnUser(event) {
        event.preventDefault()
        return (event.returnValue = "huh");
    }
    
    function handleVisblityChange() {
        myAudioFail.play()
        chrome.runtime.sendMessage("the user failed")
        document.removeEventListener("visibilitychange", handleVisblityChange);
        window.removeEventListener("beforeunload", warnUser)
    }
    
    chrome.runtime.onMessage.addListener((message) => {
        myAudioPass.play()
        document.removeEventListener("visibilitychange", handleVisblityChange);
        window.removeEventListener("beforeunload", warnUser)
    })
} catch (error) {
    console.log(error)
}