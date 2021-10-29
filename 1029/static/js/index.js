let order = "asc";
let perPage = "5";

$(document).ready(function () {
    $("#cards-box").html("");
    showArticles(1);
    $("#perPagingSelect").change(function () {
        perPage = $(this).val();
        showArticles(1)
    })
});

function openClose() {
    if ($("#post-box").css("display") == "block") {
        $("#post-box").hide();
        $("#btn-post-box").text("포스팅 박스 열기");
    } else {
        $("#post-url").val('');
        $("#post-comment").val('');
        $("#post-box").show();
        $("#btn-post-box").text("포스팅 박스 닫기");
    }
}

function postingArticle() {
    let url = $("#post-url").val();
    let comment = $("#post-comment").val();
    let idx = $("#post-idx").val();

    if (idx != '') {
        $.ajax({
            type: "PUT",
            url: "/article",
            data: {idx: idx, title: url, content: comment},
            success: function (response) {
                if (response["result"] == "success") {
                    alert("포스팅 업데이트 성공!");
                    window.location.reload();
                } else {
                    alert("서버 오류!");
                }
            }
        })
    } else {
        $.ajax({
            type: "POST",
            url: "/article",
            data: {title: url, content: comment},
            success: function (response) {
                if (response["result"] == "success") {
                    alert("포스팅 성공!");
                    window.location.reload();
                } else {
                    alert("서버 오류!");
                }
            }
        })
    }
}

function showArticles(curPage) {
    let searchTitle = $("#searchTitle").val();
    $.ajax({
        type: "GET",
        url: `/articles?perPage=${perPage}&curPage=${curPage}&order=${order}&searchTitle=${searchTitle}`,
        data: {},
        success: function (response) {
            $("#list-post").empty();
            let articles = response["articles"];
            let pagingInfo = response["pagingInfo"];
            for (let i = 0; i < articles.length; i++) {
                let num = response["pagingInfo"]["totalCount"] - (perPage * (curPage - 1)) - i
                makeListPost(articles[i], num);
            }
            makePaging(pagingInfo);
        }
    })
}

function makePaging(pagingInfo) {
    let tempHtml = '';
    for (let i = 0; i < pagingInfo['totalPage']; i++) {
        if (i + 1 == pagingInfo['curPage']) {
            tempHtml += `<li class="page-item active"><a class="page-link" href="#">${i + 1}</a></li>`;
        } else {
            tempHtml += `<li class="page-item"><a class="page-link" href="#" onclick="showArticles(${i + 1})">${i + 1}</a></li>`;
        }
    }
    $("#pagination").html(tempHtml);
}

function searching() {
    showArticles(1)
}

function getArticle(idx) {
    $.ajax({
        type: "GET",
        url: `/article?idx=${idx}`,
        data: {},
        success: function (response) {
            let title = response['article']['title']
            let content = response['article']['content']
            $("#post-url").val(title);
            $("#post-comment").val(content);
            $("#post-idx").val(idx);
            $("#post-box").show();
            $("#btn-post-box").text("포스팅 박스 닫기");
        }
    })
}

function readArticle(idx) {
    $.ajax({
        type: "PUT",
        url: `/article/${idx}`,
        data: {},
        success: function (response) {
            let title = response['article']['title']
            let content = response['article']['content']
            $('#modal-title').html(title);
            $('#modal-content').html(content);
            $('#articleModal').modal('show');
        }
    })
}

function makeListPost(post, index) {
    let tempHtml = ` <tr>
                      <th scope="row">${index}</th>
                      <td><a href="#" onclick="readArticle(${post['idx']})">${post['title']}</td>
                      <td>${post['reg_date']}</td>
                      <td>${post['read_count']}</td>
                      <td><button type="button" class="btn btn-danger" onclick="deleteArticle(${post['idx']})">삭제</button></td>
                      <td><button type="button" class="btn btn-primary" onclick="getArticle(${post['idx']})">수정</button></td>
                      </tr>
                    `;
    $("#list-post").append(tempHtml);
}

function deleteArticle(idx) {
    $.ajax({
        type: "DELETE",
        url: `/article?idx=${idx}`,
        success: function (response) { // 성공하면
            if (response["result"] == "success") {
                alert("삭제 성공!");
                window.location.reload();
            } else {
                alert("서버 오류!");
            }
        }
    })
}

function setOrder() {
    if (order == "asc") {
        order = "desc";
        $("#viewOrder").html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
  <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
</svg>`)
    } else {
        order = "asc";
        $("#viewOrder").html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
</svg>`)
    }
    showArticles(1);
}

function addFiles() {
    $("#upload").append("<input type='file' name='file'>");
}

function saveFiles() {
    var form_data = new FormData($('#upload')[0]);
    $.ajax({
        type: 'POST',
        url: '/files',
        data: form_data,
        contentType: false,
        cache: false,
        processData: false,
        success: function () {
            console.log('Success!');
        },
    });
}

// 로그인
function showLogin() {
    $('#loginModal').modal('show');
}


function showSignUp() {
    $('#signModal').modal('show');
}