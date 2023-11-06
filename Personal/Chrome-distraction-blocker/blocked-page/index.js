// display the blocked list for  the user

const list = document.getElementById("block-list")

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    res.forEach((score) => {
        let url = new URL(score.condition.urlFilter)
        if (!url.host.includes('por')){
            let listItem = document.createElement("li")
            listItem.innerHTML=listItem.innerHTML + url.host
            list.appendChild(listItem)
        }
    });
})

function handleRemove(id) {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id] 
    }).then(() => {
        location.reload()
    })
}