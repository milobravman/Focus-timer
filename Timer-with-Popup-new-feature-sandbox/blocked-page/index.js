// display the blocked list for  the user

const list = document.getElementById("block-list")

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    res.forEach((score) => {
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

function handleRemove(id) {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id] 
    }).then(() => {
        location.reload()
    })
}