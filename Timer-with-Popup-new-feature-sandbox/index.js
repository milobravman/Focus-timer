// display the blocked list for  the user

const myReg = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/
const list = document.getElementById("block-list")

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    //console.log(res)
    res.forEach((score) => {
        console.log(score);
        let temp = score.condition.urlFilter.match(myReg)
        //console.log(temp[1])
        let listItem = document.createElement("li")
        let removedListItem = document.createElement('button')
        removedListItem.id = score.id;
        removedListItem.addEventListener(
            'click',
            function (){
                handleRemove(score.id, score.condition.urlFilter)
            }
        )
        removedListItem.innerHTML = "remove"
        listItem.innerHTML=listItem.innerHTML + temp[1]
        listItem.appendChild(removedListItem)
        list.appendChild(listItem)
    });
})

function handleRemove(id, dest) {
    //document.getElementById(id)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id] 
    }).then(() => {
        console.log("attempting to reload link")
        location.href = dest
    })
}