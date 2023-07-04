// display the blocked list for  the user

 
document.getElementById('submit-block-input').addEventListener('click', handleSubmitBlock)


const urlParser = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/


function handleSubmitBlock() {
    let url = document.getElementById('block-input').value 
    console.log(url)

    //check if the url is live
    //check if submitted item is of the form http[s]://www.blah.bla

    let newRule = {};
    chrome.declarativeNetRequest.getDynamicRules().then((res) => {
        
    })
}


document.getElementById('add-to-block-list').addEventListener("click", handleShowAddtoBlock)

function handleShowAddtoBlock() {
    let hidden = document.getElementsByClassName('b-i')
    for (let i = 0; i< hidden.length; i++) {
        hidden[i].style.display="inline";
    }
    document.getElementById('add-to-block-list').style.display='none'
}

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
        //console.log("attempting to reload link")
        //location.href = dest
    })
}