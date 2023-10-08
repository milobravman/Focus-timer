// display the blocked list for  the user
const list = document.getElementById("block-list")

// document.getElementById('submit-block-input').addEventListener('click', handleSubmitBlock)

// document.getElementById('add-to-block-list').addEventListener("click", handleShowAddToBlock)

// it may be poor practice to have two different functions make rules since this and the function in popup.js
// the other option would be to make these functions send messages to the service worker, background.js and have the rules made there
// the downside would be like likely increase in time it would take for a rule to be added since there would be the extra step involved
function handleSubmitBlock() {
    let input = document.getElementById('block-input')
    try {
        let url = new URL(input.value)
        let newRule = {};
        chrome.declarativeNetRequest.getDynamicRules().then((res) => {
            let newID = 0
            res.forEach((rule) => {
                newID = newID + rule.id
            })
            newRule.id = newID+1 // collection still need +1 incase 1 or zero elements in the list 
            newRule.priority = 1
            newRule.action = {
                "type": "redirect",
                "redirect": {
                  "extensionPath": "/blocked-page/index.html"
                }
              }
            newRule.condition = {
                "urlFilter": url.origin,
                "resourceTypes": ["main_frame"]
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[newRule]
            })
            // let listItem = document.createElement("li")
            // let removedListItem = document.createElement('button')
            // removedListItem.id = newID+1
            // removedListItem.addEventListener(
            //     'click',
            //     function (){
            //         handleRemove(newID+1)
            //     }
            // )
            // removedListItem.innerHTML = "remove"
            // listItem.innerHTML=listItem.innerHTML + url.host
            // listItem.appendChild(removedListItem)
            // list.appendChild(listItem)
            input.value = ''
        })
        // html addition
    } catch (error) {
        console.log("not a valid URL")
        input.value = ''
        let errorMessage = document.getElementById('block-input-label')
        errorMessage.innerHTML = 'copy url of site to block, Ex "https://www.youtube.com"'
        errorMessage.style.color = 'red'
        //console.log(errorMessage)
    }
}

// Real time dom manipulation
function handleShowAddToBlock() {
    let hidden = document.getElementsByClassName('b-i')
    for (let i = 0; i< hidden.length; i++) {
        hidden[i].style.display="inline";
    }
    document.getElementById('add-to-block-list').style.display='none'
}

function handleRemoveWrapper(id, list){
    let buttonInfo = document.getElementById(id)
    console.log(buttonInfo)
    buttonInfo.disabled=true
    setTimeout(() => {
        let count2 = 24
        let removedListItem = document.createElement('button')
        list.appendChild(removedListItem)
        removedListItem.innerHTML = "Remove " + (count2+1)
        removedListItem.className = "buttons"
        clearInterval(unlockTimer)
        buttonInfo.style.display="none"
        buttonInfo.innerText = "Unlock"
        removedListItem.addEventListener(
            'click',
            function (){
                handleRemove(id)
            }
        )
        const lockTimer = setInterval(() => {
            removedListItem.innerHTML = "Remove " + count2
            count2 --;
        }, 1_000);
        setTimeout(() => {
            removedListItem.style.display="none"
            buttonInfo.style.display="inline"
            buttonInfo.disabled=false
            clearInterval(lockTimer)
        }, 25_000);
        
    }
    , 90_000)
    let count = 88
    const unlockTimer = setInterval(() => {
        buttonInfo.innerText = count
        count--;
    }, 1_000);
}

//deletes a rule
function handleRemove(id) {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id] 
    }).then(() => {
        let toRemove = document.getElementById(id)
        toRemove.parentElement.remove()
    })
}

//Populates the page with the blocked websites
//Not wrapped in a function since I want it called every time the page loads
chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    res.forEach((score) => {
        let url = new URL(score.condition.urlFilter)

        if (!url.host.includes('por')){
            // let listItem = document.createElement("li")
            // listItem.innerHTML=listItem.innerHTML + url.host
            // list.appendChild(listItem)
            console.log(score);
            let listItem = document.createElement("li")
            listItem.className = "list-item"
            let removedListItem = document.createElement('button')
            removedListItem.id = score.id
            removedListItem.addEventListener(
                'click',
                function (){
                    handleRemoveWrapper(score.id, listItem)
                }
            )
            removedListItem.innerHTML = "Unlock"
            removedListItem.className = "buttons"
            listItem.innerHTML=listItem.innerHTML + url.host
            listItem.appendChild(removedListItem)
            list.appendChild(listItem)
        }
    });
})

/*
How it could work
User goes to restricted page
Timer starts counting to the limit
If the limit is reached
The blocking rule is added
A timestamp is created for when this rule should be automatically removed
When the service worker loads it needs to check if there are any restricted websites actively blocked and if the should be unblocked
If the use leaves the page before the limit is reached
The time resets
This opens a loophole of leaving and coming back to the page
so maybe the # of visits to a restricted page should also call for blocking
*/

// document
//     .getElementById("submit-restrict-input")
//     .addEventListener("click", checkValidURL)

// handle Submit Restrict functions

// function checkValidURL() {
//     try {
//     let url = new URL(document
//         .getElementById("restrict-input-url").value)
//     let timeToAllow = document
//         .getElementById("restrict-input-time-using").value
//     let timeToBlock = document
//         .getElementById("restrict-input-time-cooldown").value
//     addToLocalStorage(url, timeToAllow, timeToBlock)
//     } catch (error) {
//         console.log('nope');
//         // add error message for user
//     }
// }

function addToLocalStorage(url, timeA, timeB) {
    let existing = []
    chrome.storage.local.get("rules").then((res) => {
        console.log(res)
    })
    chrome.storage.local.set({rules: [{
        url: url.origin,
        timeSiteAllowed: timeA,
        timeSiteBlocked: timeB
    }]})
}
