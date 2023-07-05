// display the blocked list for  the user
 
const list = document.getElementById("block-list")

document.getElementById('submit-block-input').addEventListener('click', handleSubmitBlock)

document.getElementById('add-to-block-list').addEventListener("click", handleShowAddtoBlock)

// it may be poor practice to have two different functions make rules since this and the function in popup.js
// the other option would be to make these functions send messages to the service worker, background.js and have the rules made there
// the downside would be like likely increase in time it would take for a rule to be added since there would be the extra step involved
function handleSubmitBlock() {
    try {
        let url = new URL(document.getElementById('block-input').value)
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
                  "extensionPath": "/index.html"
                }
              }
            newRule.condition = {
                "urlFilter": url.origin,
                "resourceTypes": ["main_frame"]
            }
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules:[newRule]
            })
            let listItem = document.createElement("li")
            let removedListItem = document.createElement('button')
            removedListItem.id = newID+1
            removedListItem.addEventListener(
                'click',
                function (){
                    handleRemove(newID+1)
                }
            )
            removedListItem.innerHTML = "remove"
            listItem.innerHTML=listItem.innerHTML + url.host
            listItem.appendChild(removedListItem)
            list.appendChild(listItem)
        })
        // html addition
    } catch (error) {
        console.log("not a valid URL")
        document.getElementById('block-input').value = ''
        let errorMessage = document.getElementById('block-input-label')
        errorMessage.innerHTML = 'copy url of site to block, Ex "https://youtube.com"'
        errorMessage.style.color = 'red'
        //console.log(errorMessage)
    }
}

// Real time dom manipulation
function handleShowAddtoBlock() {
    let hidden = document.getElementsByClassName('b-i')
    for (let i = 0; i< hidden.length; i++) {
        hidden[i].style.display="inline";
    }
    document.getElementById('add-to-block-list').style.display='none'
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
        console.log(score);
        let url = new URL(score.condition.urlFilter)
        let listItem = document.createElement("li")
        let removedListItem = document.createElement('button')
        removedListItem.id = score.id;
        removedListItem.addEventListener(
            'click',
            function (){
                handleRemove(score.id)
            }
        )
        removedListItem.innerHTML = "remove"
        listItem.innerHTML=listItem.innerHTML + url.host
        listItem.appendChild(removedListItem)
        list.appendChild(listItem)
    });
})
