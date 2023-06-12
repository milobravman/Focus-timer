/*
This script is injected into webpages to set a timer and play a sound. if the user stays on the page
and the timer end a happy sound will play, otherwise if the user leaves early an angry sound will play. 
*/

// try-cautch fixed a bug that occered if the user activated the timer twice 
try { 
    let total_seconds = 10 // controls how long the timer is active
    

    let timer = setInterval(countDown, 1000) // runs the function countdown every 1 second
    
    chrome.runtime.sendMessage(
    {
      reset: "yes"
    }, response => {
      if(response > 0){
        total_seconds = 10;
      }
    })

    // next will be first checking to see if this listener exists and if it does first remove it than add it. this is think will effectivly reset the timer
    document.addEventListener("visibilitychange", handleVisblityChange)
    
    timer
    //checks if the count is over
        // if the couunt is over it clears the event listener, stops the interval on this fuction and plays the secces sound 
    function countDown () {
        if (total_seconds === 1){
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisblityChange);
            playSuccsess()
          }
          console.log(total_seconds);
          total_seconds--;
    }
    
    
    function playSuccsess() {
        var myAudio = new Audio(chrome.runtime.getURL("./yay-6120.mp3"));
        myAudio.play();
      }
    
    function playFail() {
        var myAudio = new Audio(chrome.runtime.getURL("./t-rex-roar.mp3"));
        myAudio.play();
      }
    
    
    // if the user leaves the tab before the timer is over, play failure sound and clear timer
    function handleVisblityChange() {
        playFail();
        clearInterval(timer);
        document.removeEventListener("visibilitychange", handleVisblityChange)
    }
} catch (error) {
  console.log(error)   
}