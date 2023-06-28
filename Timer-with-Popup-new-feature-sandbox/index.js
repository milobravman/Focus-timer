// display the blocked list for  the user

const myReg = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/

chrome.declarativeNetRequest.getDynamicRules().then((res)=>{
    //console.log(res)
    res.forEach((score) => {
        let temp = ''
        console.log(score.condition.urlFilter);
        temp = temp.replace(score.condition.urlFilter)
        console.log(temp)
    });

})

