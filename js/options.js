
let save = document.getElementById("save");
save.addEventListener("click", () => {
    save.style.backgroundColor = "#3264B7";
    save.setAttribute("disabled", false);
    var nToken = document.getElementById("token").value;
    var pageID = document.getElementById("pageid").value;
    if (createDatabase(nToken, pageID)) {
        chrome.storage.local.set({ nToken: nToken });
        chrome.storage.local.set({ pageID: pageID });
    };

})

function createDatabase(nToken, pageID) {
    let body = {
        "parent": { "type": "page_id", "page_id": pageID },
        "title": [
            {
                "type": "text",
                "text": {
                    "content": "BookList",
                    "link": null
                }
            }
        ],
        "properties": {
            "书名": {
                "title": {}
            },
            "作者": {
                "rich_text": {}
            },
            "出版社": {
                "rich_text": {}
            },
            "出版年月": {
                "rich_text": {}
            },
            "页数": {
                "number": {
                    "format": "number"
                }
            },
            "评分": {
                "number": {
                    "format": "number"
                }
            },
            "ISBN": {
                "rich_text": {}
            },
            "封面": {
                "files": {}
            },
            "豆瓣链接": {
                "url": {}
            },
        }
    };
    let options = {
        method: 'POST',
        headers: {
            Authorization: "Bearer " + nToken,
            "Notion-Version": "2022-02-22",
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(body)
    }
    fetch("https://api.notion.com/v1/databases", options)
        .then((response) => { return response.json() })
        .then((response) => {
            if (response.object === "error") {
                alert(response);
                return false;
            } else {
                chrome.storage.local.set({ "databaseID": response.id });
                chrome.storage.local.get("databaseID", (data) => { console.log(data.databaseID) });
                alert("保存并创建Database成功!")
                return true;
            }
        })
        .then(()=>{
            save.style.backgroundColor = "#4285f4";
            save.setAttribute("disabled", true);
        });
}
