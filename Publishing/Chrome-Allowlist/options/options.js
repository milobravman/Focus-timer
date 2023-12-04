// display the blocked list for  the user
let mainButtonTimer = null
let unlockTimer = null
const list = document.getElementById("block-list")


const t = document.addEventListener("visibilitychange", (event) => {
    location.reload();
});


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
            input.value = ''
        })
        // html addition
    } catch (error) {
        //console.log("not a valid URL")
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


// This function may be a little hard to read because it uses...
// ------- Nested setTimouts and setInteravals! -------
function handleRemoveWrapper(id, list){
    let buttonInfo = document.getElementById(id)
    //console.log(buttonInfo)
    //console.log(list)
    buttonInfo.disabled=true
    mainButtonTimer = setTimeout(() => { // this is gonna controle the button that actally removes the rule 
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
            let missedButton = document.createElement('span')
            list.appendChild(missedButton)
            missedButton.innerText = "You missed the remove button! please try again!"
            missedButton.style.color="red"
            missedButton.className = "error"
        }, 25_000);
        
    }
    , 90_000)
    mainButtonTimer
    let count = 88
    unlockTimer = setInterval(() => {
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
    });
})

function addToLocalStorage(url, timeA, timeB) {
    let existing = []
    chrome.storage.local.get("rules").then((res) => {
        //console.log(res)
    })
    chrome.storage.local.set({rules: [{
        url: url.origin,
        timeSiteAllowed: timeA,
        timeSiteBlocked: timeB
    }]})
}
