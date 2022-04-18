
console.log("注入成功")
function getBookInfo(){
    let infos = document.getElementById("info").getElementsByClassName("pl");
    var book = {};
    book["title"] = document.getElementsByTagName("h1")[0].getElementsByTagName("span")[0].innerText;
    book["封面"] = document.getElementsByClassName("nbg")[0].href;
    book["评分"] = document.getElementsByClassName("rating_num")[0].innerText;
    for(let info of infos) {
        if(info.innerText === "作者") {
            book["作者"] = info.nextSibling.nextSibling.innerText
        }
        else if(info.innerText === "出版社:") {
            book["出版社"] = info.nextSibling.nextSibling.innerText
        }
        else {
            prop = info.innerText.substr(0,info.innerText.length-1)
            book[prop] = info.nextSibling.data
        }  
    }
    return book
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request.message)
        sendResponse({book: getBookInfo()});
    }
  );