// display the blocked list for  the user

const myReg = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/
const list = document.getElementById("block-list")

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    
    // let col = 0
    res.forEach((score) => {
        // col = col + score.id
        // console.log("new id" + col)
        console.log(score);
        let temp = score.condition.urlFilter.match(myReg)
        //console.log(temp[1])
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
        listItem.innerHTML=listItem.innerHTML + temp[1]
        listItem.appendChild(removedListItem)
        list.appendChild(listItem)
    });
})

function handleRemove(id) {
    //document.getElementById(id)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [id] 
    }).then(() => {
        //console.log("attempting to reload link")
        //location.href = dest
        location.reload()
    })
}