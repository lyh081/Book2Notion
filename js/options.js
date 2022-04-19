let save = document.getElementById("save");
let reset = document.getElementById("reset");

checkPlaceHolder();

save.addEventListener("click", () => {
    save.style.backgroundColor = "#3264B7";
    save.setAttribute("disabled", "disabled");
    var nToken = document.getElementById("nToken").value;
    var pageID = document.getElementById("pageID").value;
    createDatabase(nToken, pageID);
})

reset.addEventListener("click", () => {
    resetM();
});

function checkPlaceHolder() {
    chrome.storage.local.get(["nToken","pageID"], (data)=>{
        // 未保存token和pageid
        if( data["nToken"] === undefined || data["pageID"] === undefined) {
            document.getElementById("nToken").innerText = 'token'
            document.getElementById("pageID").innerText = 'pageID'
            reset.style.backgroundColor = "#cecece";
            reset.setAttribute("disabled","disabled")
            save.style.backgroundColor = "#4285f4";
            save.removeAttribute("disabled");
        // 已经保存token和pageid
        } else {
            document.getElementById("nToken").innerText = data["nToken"]
            document.getElementById("pageID").innerText = data["pageID"]
            save.style.backgroundColor = "#cecece";
            save.setAttribute("disabled","disabled")
            reset.style.backgroundColor = "#4285f4";
            reset.removeAttribute("disabled");

        }
    });
};

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
                checkPlaceHolder();
                alert(response.message);
            } else {
                chrome.storage.local.set({ "databaseID": response.id });
                chrome.storage.local.set({ nToken: nToken, pageID: pageID}, ()=>{
                    checkPlaceHolder();
                    alert("创建Database并保存成功!")
                });
            }
        });
}

function resetM() {
    chrome.storage.local.remove(["nToken","pageID"],()=>{
        checkPlaceHolder();
    });
}
