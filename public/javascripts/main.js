const socket  = io("https://new-social-clone.herokuapp.com/")

socket.on("server-send-notification", data => {
  $(".alert-new-notification").append(`
    <div id="message" class="fixed-top" >
      <div style="padding: 5px;">
          <div id="inner-message" class="alert alert-success">
              <span>Khoa ${data.faculty.name} vừa đăng thông báo mới<span/>
              <a href="/notification/detail/${data.id}">Click vào đây để xem chi tiết</a>
          </div>
      </div>
    </div>
  `)
  setTimeout(() => {
    $("#message").remove()
  },5000);
})

$(document).ready(() => {
  hideandshowNoti();
  addPost();
  scrollLoadData();
  addUser();
  changePassword();
  updateAccount();
  addNotification();
});

function scrollLoadData() {
  let pathName = window.location.pathname.split("/");
  let check = pathName[pathName.length - 1];
  let path = pathName[pathName.length - 2]
  var start = 1;
  let limit = 10;
  if (check.length >= 21 && path === 'profile' || check === "") {
    $(window).scroll(function () {
      if (Math.abs($(window).scrollTop() - ($(document).height() - $(window).height())) < 1 ) {
        fetch("/post/load", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start: start,
            limit: limit,
          }),
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.code === 0) {
              let id = $("#index_id_user").html();
              start = start + 1;
              let p = json.post;
              let comments = json.comments;
              p.forEach((post) => {
                if (id === post.user.id) {
                  if (post.urlFile.length > 0) {
                    $(".index_body_post").append(renderPostImage(post));
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    });
                  } else if (post.idVideos.length > 0) {
                    $(".index_body_post").append(renderPostVideo(post))
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    });
                  } else {
                    $(".index_body_post").append(renderPostChar(post))
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    })
                  }
                } else {
                  let time = moment(post.time).fromNow()
                  if (post.urlFile.length > 0) {
                    $(".index_body_post").append(renderPostImageDifferentUser(post));
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    });
                  } else if (post.idVideos.length > 0) {
                    $(".index_body_post").append(renderPostVideoDifferentUser(post));
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    });
                  } else {
                    $(".index_body_post").append(renderPostCharDifferentUser(post))
                    comments.forEach((cmt) => {
                      if (cmt.idPost === post.id) {
                        if(cmt.user.id === id){
                          renderCommentLikeUser(cmt)
                        }else {
                          renderCommentDifferentUser(cmt)
                        }
                      }
                    })
                  }
                }
              });
            }
          })
          .catch((err) => console.log(err));
      }
    });
  }
}

function addUser() {
  $("#index_create_add_user").click(function () {
    $("#index_modal_add_user").modal();
    $("#btn_add_user").click(() => {
      let input = [...$("input[name='faculty']")];
      let arrFaculty = new Array();
      input.forEach((f) => {
        if (f.checked) {
          let id = f.attributes.id.value;
          let name = f.attributes.value.value;
          let faculty = {
            idFaculty: id,
            name: name,
          };
          arrFaculty.push(faculty);
        }
      });
      let email = $("#email_user").val();
      let password = $("#password_user").val();
      let name = $("#name_user").val();
      fetch("/account/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          name: name,
          password: password,
          arrFaculty: arrFaculty,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code == 0) {
            alert("Thêm thành công");
            $("#index_modal_add_user").modal("hide");
          } else if (json.code === 1) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Please enter full information!");
          } else if (json.code === 2) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Email already exist!");
          }else if(json.code === 3) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Email invalid!");
          }
        })
        .catch((err) => console.log(err));
    });
  });
}

function changePassword() {
  $("#index_change_password").click(() => {
    $("#index_modal_change_password").modal("show");
    $("#btn_change_password").click(() => {
      let oldPassword = $("#old_password").val();
      let newPassword = $("#new_password").val();
      fetch("/account/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.code === 0) {
            alert("Change Password Success");
            $("#index_modal_change_password").modal("hide");
          } else if (json.code === 2) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Password Incorrect!");
          } else if (json.code === 1) {
            $(".index_add_user_alert").css("display", "block");
            $(".index_add_user_alert").html("Please enter full information!");
          }
        });
    });
  });
}

function updateAccount(){
  $("#index_create_edit_profile").click((e) => {
    $(".profile_edit_profile_alert_danger").css("display","none")
    $("#profile_img_upload").val("")
    let name = $("#profile_label_name").html()
    let email = $(".profile_info_email").html()
    $(".profile_update_name").val(name)
    $(".profile_info_email_modal").html(email)
    $("#index_modal_edit_profile").modal("show")
    $("#btn_update_profile").click((e) => {
      if( $(".profile_update_name").val() === ""){
        $(".profile_edit_profile_alert_danger").css("display","block")
        $(".profile_edit_profile_alert_danger").html("Please enter name !")
      }else {
        let name = $(".profile_update_name").val()
        let inputFile = document.getElementById("profile_img_upload")
        let file = null
        if (inputFile.files.length > 0) {
          file = inputFile.files[0];
        }
        if(file === null && name === $("#profile_label_name").html()){
          $(".profile_edit_profile_alert_danger").css("display","block")
          $(".profile_edit_profile_alert_danger").html("You don't have change anything !")
        }
        else {
          let form = new FormData()
          if(name === $("#profile_label_name").html()){
          }else {
            form.set("name",name)
          }
          form.set("image",file)
          let xhr = new XMLHttpRequest()
          xhr.open("POST", "/account/update",true)
          xhr.addEventListener("load", e => {
            if(xhr.status === 200 && xhr.readyState === 4 ){
              let json = JSON.parse(xhr.responseText)
              if(json.code === 0){
                if(json.code === 0) {
                  let acc = json.acc
                  $("#profile_label_name").html(acc.name)
                  $(".profile_info_name").html(acc.name)
                  $(".profile_avatar").attr('src',acc.img)
                  $(".index_avt_profile_in_the_tab").attr('src',acc.img)

                  let name_cmt  = document.querySelectorAll("#profile_name_span")
                  name_cmt.forEach(n => {
                    n.innerHTML = acc.name
                  })
                  let avt_post = document.querySelectorAll("#profile_avt")
                  avt_post.forEach(avt => {
                    avt.src = acc.img
                  })
                  $("#index_modal_edit_profile").modal("hide")
                }
              }
            }
          })
          xhr.send(form)
        }
      }
    })
  })
}

function addPost() {
  $("#index_create_new_post").click(function () {
    $("#index_modal_new_post").modal("show");
    clearDataModal()
    $("#btn-post-ytb").click(() => {
      $("#input-post-ytb").css("display", "block");
    });
    $("#btn-post-img").click(() => {
      $("#input-post-img").click();
      $("#input-post-img").css("display", "block");
    });
    $("#data-post").focus()
  });
  $("#btn-create-post").click((e) => {
    let btn = e.target
    let email = btn.dataset.email
    let data = $("#data-post").val()
    let urlYoutube = $("#input-post-ytb").val()
    let inputFile = document.getElementById("input-post-img")
    let file = null
    var video_id = ""
    if (urlYoutube != "") {
      video_id = urlYoutube.split("v=")[1]
      var ampersandPosition = video_id.indexOf("&")
      if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition)
      }
      if(video_id === ""){
        $(".index_alert_post_fail").css("display", "block");
        $(".index_alert_post_fail").html("Link Youtube Invalid!");
      }
    }
    if (inputFile.files.length > 0) {
      file = inputFile.files[0];
    }

    let xhr = new XMLHttpRequest()
    let form = new FormData()
    form.set("email", email)
    form.set("data", data)
    form.set("YoutubeId", video_id)
    form.set("attachment", file)
    xhr.open("POST", "/post/add", true)
    xhr.addEventListener("load", (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let json = JSON.parse(xhr.responseText);
        if (json.code === 0) {
          let post = json.post;
          if (post.urlFile.length > 0) {
            $(".index_body_post").prepend(renderPostImage(post))
            $("#index_modal_new_post").modal("hide");
          } else if (post.idVideos.length > 0) {
            $(".index_body_post").prepend(renderPostVideo(post))
            $("#index_modal_new_post").modal("hide");
          } else {
            $(".index_body_post").prepend(renderPostChar(post))
            $("#index_modal_new_post").modal("hide");
          }
        } else if (json.code === 1) {
          $(".index_alert_post_fail").css("display", "block");
          $(".index_alert_post_fail").html("Please enter the data!");
        } else if (json.code === 3) {
          $(".index_alert_post_fail").css("display", "block");
          $(".index_alert_post_fail").html("Link Youtube Invalid!");
        }else {
          $(".index_alert_post_fail").css("display", "block");
          $(".index_alert_post_fail").html("Try again!");
        }
      }
    });
    xhr.send(form);
  });
}

function deletePost(e) {
  let id = e.id;
  fetch("/post/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 0) {
        $(`div#${id}`).remove();
      }
    })
    .catch((err) => console.log(err));
}

function addComments(e) {
  let id = e.id;
  let data = $(`#index_data_cmt${id}`).val();
  if (data && id) {
    fetch("/comments/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idPost: id,
        data: data,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          let cmt = json.cmt;
          renderCommentLikeUser(cmt)
          $(`#index_data_cmt${id}`).val("");
        }
      })
      .catch((err) => console.log(err));
  }
}

function deleteComments(e) {
  let id = e.id;
  fetch("/comments/delete/" + id, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.code === 0) {
        $(`div#${id}`).remove();
      }
    })
    .catch((err) => console.log(err));
}

function addNotification() {
  $("#button_create_notification").click(() => {
    $("#title-notification").val("")
    $("#data-notification").val("")
    $("#index_modal_create_noti").modal()
    $("#datepicker").datepicker({         
      autoclose: true,         
      todayHighlight: true 
      }).datepicker('update', new Date())

     $("#btn_create_notification").click(() => {
        let datePost = $("#datepicker").find("input").val()
        let title = $("#title-notification").val()
        let data = $("#data-notification").val()
        var idFaculty = $("#select-faculty-post").find("option:selected").attr("id")
        $("#select-faculty-post").on('change', () => {
            idFaculty = $("#select-faculty-post").find("option:selected").attr("id")
        })
        if(!datePost || !title || !data || !idFaculty ) {
          console.log(datePost,title,data,idFaculty)
          $(".index_add_user_alert").css("display", "block")
          $(".index_add_user_alert").html("Please enter all information")
        } else {
          fetch("/notification/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              idFaculty: idFaculty,
              datePost: datePost,
              title: title,
              data: data
            })
          })
          .then(res => res.json())
          .then(json => {
              if(json.code === 0) {
                let notification = json.notification
                renderNotification(notification)
                $("#index_modal_create_noti").modal("hide")
                socket.emit("client-send-notification",notification)
              }
          })
          .catch(err => console.log(err))
        }
     })
  })
}

function deleteNotification(e) {
    let id = e.id
    fetch("/notification/delete/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.code === 0) {
          $(`li#${id}`).remove();
        }
      })
      .catch((err) => console.log(err));
}

function clearDataModal() {
    $("#data-post").val("");
    $("#input-post-ytb").css("display", "none");
    $("#input-post-img").css("display", "none");
    $("#input-post-ytb").val("");
    $("#input-post-img").val("");
    $(".index_alert_post_fail").css("display", "none");
}

function hideandshowNoti(){
    $("#bttn").click(()=>{
      let check = $("#bttn").attr('aria-expanded')
      if(check === 'true'){
        $("#phimthongbaoall").css("display","none");
        $("#bttn").attr('aria-expanded',false)
      }else {
        $("#phimthongbaoall").css("display","block");
        $("#bttn").attr('aria-expanded',true)
      }
    });
}

function renderCommentLikeUser(cmt){
  $(`#collapseCmt${cmt.idPost}`).append(`
    <div id="${cmt.id}">
    <a class="profile_da_cmt" href="/account/profile"><img id="profile_avt" class="index_avt_cmt" src="${ cmt.user.img}"> <span id="profile_name_span">${cmt.user.name} :</span></a>
      <div class="index_da_cmt">
          <p class=" card noidungcmt">${cmt.data}</p>
              <div class="dropdown edit_and_delete_incmt">
                  <button class="btn index_button_in_the_cmt" type="button" id="dropdownMenuButtonCmt" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  ...
                  </button>
                      <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonCmt">
                      <button class="dropdown-item" id="${cmt.id} " onclick="deleteComments(this)"><i class="fas fa-trash"></i> Delete</button>
                      </div>
            </div>
        </div>
    </div>
    `);
}

function renderCommentDifferentUser(cmt){
  $(`#collapseCmt${cmt.idPost}`).append(`
    <div id="${cmt.id}">
    <a class="profile_da_cmt" href="/account/profile"><img id="profile_avt" class="index_avt_cmt" src="${ cmt.user.img}"> <span id="profile_name_span">${cmt.user.name} :</span></a>
      <div class="index_da_cmt">
          <p class=" card noidungcmt">${cmt.data}</p>
      </div>
    </div>
    `);
}

function renderPostChar(post){ 
  let time = moment(post.time).fromNow()
  return `<div class="card index_poster" id="${post.id}">
    <div class="card index_on_the_cmt">
      <div class="index_post_title_option">  
      <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
      <aside>${time}</aside>
      <div class="dropdown edit_and_delete_inpost">
        <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        . . .
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
          <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
          <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
        </div>
      </div>
      </div>
      <aside>${post.data}</aside>
      <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
      <div class="collapse" id="collapseCmt${post.id}">
        <div class=" index_cmt" id="${post.id}>">
          <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
          <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
          <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
         </div>
      </div>
    </div>`
}

function renderPostCharDifferentUser(post){ 
  let time = moment(post.time).fromNow()
  return `<div class="card index_poster" id="${post.id}">
    <div class="card index_on_the_cmt">
      <div class="index_post_title_option">  
      <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
      <aside>${time}</aside>
      </div>
      <aside>${post.data}</aside>
      <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
      <div class="collapse" id="collapseCmt${post.id}">
        <div class=" index_cmt" id="${post.id}>">
          <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
          <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
          <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
         </div>
      </div>
    </div>`
}

function renderPostVideo(post){
  let time = moment(post.time).fromNow()
  return `<div class="card index_poster" id="${post.id}">
    <div class="card index_on_the_cmt">
        <div class="index_post_title_option">  
        <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
          <aside>${time}</aside> 
          <div class="dropdown edit_and_delete_inpost">
              <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              . . .
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>  
              </div>
            </div>
          </div>
          <aside>${post.data}</aside>
          <iframe class="index_video_post"  src="https://www.youtube.com/embed/${post.idVideos}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
    <div class="collapse" id="collapseCmt${post.id}">
      <div class=" index_cmt" id="${post.id}>">
        <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
        <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
        <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
      </div>
    </div>
  </div>`
}

function renderPostVideoDifferentUser(post){
  let time = moment(post.time).fromNow()
  return `<div class="card index_poster" id="${post.id}">
    <div class="card index_on_the_cmt">
        <div class="index_post_title_option">  
        <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
          <aside>${time}</aside> 
          </div>
          <aside>${post.data}</aside>
          <iframe class="index_video_post"  src="https://www.youtube.com/embed/${post.idVideos}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
    <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
    <div class="collapse" id="collapseCmt${post.id}">
      <div class=" index_cmt" id="${post.id}>">
        <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
        <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
        <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
      </div>
    </div>
  </div>`
}

function renderPostImage(post){
  let time = moment(post.time).fromNow()
   return `<div class="card index_poster" id="${post.id}">
      <div class="card index_on_the_cmt">
        <div class="index_post_title_option"> 
          <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
          <aside>${time}</aside>
          <div class="dropdown edit_and_delete_inpost">
              <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonPost" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
              . . .
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonPost">
                <button class="dropdown-item" id="${post.id}" onclick="deletePost(this)"><i class="fas fa-trash"></i> Delete</button>
                <button class="dropdown-item"><i class="fas fa-edit"></i> Edit</button>
              </div>
          </div>
        </div>
        <aside>${post.data}</aside>
        <img class="index_img_post" src="/${post.user.email}/${post.nameFile}" alt="">
      </div>
        <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
        <div class="collapse" id="collapseCmt${post.id}">
          <div class="index_cmt" id="${post.id}>">
            <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
            <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
            <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
          </div>
        </div>
    </div>`
}

function renderPostImageDifferentUser(post){
  let time = moment(post.time).fromNow()
   return `<div class="card index_poster" id="${post.id}">
      <div class="card index_on_the_cmt">
        <div class="index_post_title_option"> 
          <a href="/account/profile/${post.user.id}" class="index_post_avtname"><img id="profile_avt" class="index_avt_post" src="${post.user.img}"><span id="profile_name_span">${post.user.name}</span></a>
          <aside>${time}</aside>
        </div>
        <aside>${post.data}</aside>
        <img class="index_img_post" src="/${post.user.email}/${post.nameFile}" alt="">
      </div>
        <button type="button" class="btn btn-light index_button_cmt" id="" name="" value="" data-toggle="collapse" href="#collapseCmt${post.id}" role="button" aria-expanded="false" aria-controls="collapseCmt${post.id}"><i class="far fa-comment-dots"></i>  Comment</button>
        <div class="collapse" id="collapseCmt${post.id}">
          <div class="index_cmt" id="${post.id}>">
            <img id="profile_avt" class="index_avt_cmt" src="${post.user.img}">
            <input type="text" class="form-control index_cmt_texbox" id="index_data_cmt${post.id}" value="" placeholder="Your comment..." name="">
            <button id="${post.id}" class="btn btn-primary" onclick="addComments(this)">Send</button>
          </div>
        </div>
    </div>`
}

function renderNotification(notification) {
    $(".thongbaoquangtrong").prepend(
      `<li class="nav-item oi" id="${notification.id}">
        <div class ="newthongbao">
          <a class="card thongbao_info" href="/notification/detail/${notification.id}">
            <div class="title_thongbao">${ notification.title }</div>
            <div class="khoathongbao">${ notification.faculty.name }</div>
            <div class="ngaythongbao">${ notification.datePost }</div>
            <div class="noidungthongbao">${ notification.data }</div>   
          </a>
          <div class="dropdown edit_and_delete_noti">
            <button class="btn index_button_in_the_post" type="button" id="dropdownMenuButtonNoti" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            ...
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButtonNoti">
                <button class="dropdown-item" id="${notification.id}" onclick="deleteNotification(this)"><i class="fas fa-trash"></i> Delete</button>
                <button class="dropdown-item" id="button_edit_notification"><i class="fas fa-edit"></i> Edit</button>
            </div>
          </div>
        </div>
    </li>`
    )
}