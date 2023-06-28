// display the blocked list for  the user

const myReg = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/
const list = document.getElementById("block-list")

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    //console.log(res)
    res.forEach((score) => {
        console.log(score.condition.urlFilter);
        let temp = score.condition.urlFilter.match(myReg)
        //console.log(temp[1])
        let listItem = document.createElement("li")
        listItem.innerHTML=listItem.innerHTML + temp[1];
        list.appendChild(listItem)
    });

})

