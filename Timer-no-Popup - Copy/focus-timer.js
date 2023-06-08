/*
This script is injected into webpages to set a timer and play a sound. if the user stays on the page
and the timer end a happy sound will play, otherwise if the user leaves early an angry sound will play. 
*/

//Clock icon by Icons8

// try-cautch fixed a bug that occered if the user activated the timer twice 
try { 
    let total_seconds = 600 // controls how long the timer is active
    

    let timer = setInterval(countDown, 1000) // runs the function countdown every 1 second
    
    
    console.log("vis-listener added")
    document.addEventListener("visibilitychange", handleVisblityChange)// if the user leaves the page it exacutes the function


    let myAudio = new Audio(chrome.runtime.getURL("./audio/t-rex-roar.mp3")); //declaring the audio file out here fixes the first-time-pressed issue

    
    timer // starts the timer


    function countDown () {
        if (total_seconds === 1){
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisblityChange);
            playSuccsess()
            chrome.runtime.sendMessage(
            {
                reset: "yes"
            })
          }
          console.log(total_seconds);
          total_seconds--;
    }
    
    
    function playSuccsess() {
        let myAudio1 = new Audio(chrome.runtime.getURL("./audio/yay-6120.mp3"));
        myAudio1.play();
      }
    
    function playFail() {
        console.log("play-fail-fired!")
        myAudio.play();
      }
    
    
    // if the user leaves the tab before the timer is over, play failure sound and clear timer
    function handleVisblityChange() {
        console.log("handleChanged fired!")
        playFail();
        clearInterval(timer);
        chrome.runtime.sendMessage(
        {
          reset: "yes"
        })
        document.removeEventListener("visibilitychange", handleVisblityChange)
    }
} catch (error) {
  console.log(error)   
}