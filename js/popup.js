
let send2Notion = document.getElementById("post")
var book = {};
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var url = new RegExp('https://book.douban.com/subject/.*?/');
    if(url.test(tabs[0].url)=== false){
        send2Notion.setAttribute("disabled", true);
        send2Notion.style.backgroundColor = "gray";
    }
    else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "Preview"}, function(response) {
                book = response.book;
                book["豆瓣链接"] = tabs[0].url;
                showPreview(book)
            });
          });
    }
});

send2Notion.addEventListener("click", ()=>{
    send2Notion.style.backgroundColor = "#3264B7";
    send2Notion.setAttribute("disabled", false);
    createItem(book)
});

function showPreview(book) {

    // preTitle
    var preTitle= document.getElementById("pretitle");
    var title = document.createElement("p");
    title.setAttribute("id","preTitle");
    title.innerText = book['title'];
    preTitle.appendChild(title);
    
    // preCover
    var preCover= document.getElementById("cover");
    var cover = document.createElement("img");
    cover.setAttribute("src",book["封面"]);
    preCover.appendChild(cover);

    var pre = document.getElementById("pre");
    var preInfos = ["作者","评分","出版社","出版年","页数","ISBN"]
    for(let info of preInfos){
        var p = document.createElement("p");
        p.innerText = info + ":" + book[info];
        pre.appendChild(p);
    }
    // pre.appendChild(document.createElement("hr"));

}

function createItem(book) {
    let options, body;
    chrome.storage.local.get("databaseID", (data)=> {
        body = {
            "parent": { "type": "database_id", "database_id": data.databaseID },
            "properties": {
                "书名": {
                    "type": "title",
                    "title": [{ "type": "text", "text": { "content": book["title"] } }]
                },
                "豆瓣链接": {
                    "url": book["豆瓣链接"]
                },
                "ISBN": {
                    "type": "rich_text",
                    "rich_text": [{ "type": "text", "text": { "content": book["ISBN"] } }]
                },
                "页数": {
                    "number": parseInt(book["页数"])
                },
                "出版社": {
                    "type": "rich_text",
                    "rich_text": [{ "type": "text", "text": { "content": book["出版社"] } }]
                },
                "出版年月": {
                    "type": "rich_text",
                    "rich_text": [{ "type": "text", "text": { "content": book["出版年"] } }]
                },
                "评分": {
                    "number": parseFloat(book["评分"])
                },
                "作者": {
                    "type": "rich_text",
                    "rich_text": [{ "type": "text", "text": { "content": book["作者"]} }]
                },
                "封面": {
                    "files": [
                        {
                            "type": "external",
                            "name": "cover",
                            "external": { "url": book["封面"]}
                        }
                    ]
                },
            },
        };
        chrome.storage.local.get("nToken", (data)=> {
            options = {
                method: 'POST',
                headers: {
                    Authorization: "Bearer " + data.nToken,
                    "Notion-Version": "2022-02-22",
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify(body)
            }
        
            fetch("https://api.notion.com/v1/pages",options)
            .then((response) => { return response.json() })
            .then((response) => {
                if (response.object === "error") {
                    alert(response);
                    return false;
                } else {
                    alert("书籍信息保存到Notion!")
                    return true;
                }
            })
            .then(()=>{
                send2Notion.style.backgroundColor = "#4285f4";
                send2Notion.setAttribute("disabled", true);
            });
        });
    });

}

