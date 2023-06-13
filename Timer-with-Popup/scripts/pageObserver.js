//this script is responsable for making and firing audio that signifies if the user was succesful in staying focused or not.
try {
    console.log("script is online!!!!")

    let userFailed = false
    
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
        if (!userFailed){
            myAudioPass.play()
            document.removeEventListener("visibilitychange", handleVisblityChange);
            console.log(message)
        }
    })
} catch (error) {
    
}