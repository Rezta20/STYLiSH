let facebookToken = {
  provider: "facebook",
  access_token: "",
};

Fbfamily();
function Fbfamily() {
  window.fbAsyncInit = function () {
    FB.init({
      appId: "406787630333086",
      cookie: true,
      xfbml: true,
      version: "v8.0",
    });
    FB.getLoginStatus(function (response) {
      //   statusChangeCallback(response);
      //   console.log(response);
      if (response.status === "connected") {
        facebookToken.access_token = response.authResponse.accessToken;
      }
    });
    FB.AppEvents.logPageView();
    // console.log("huh");
  };

  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");

  // 確認是否每頁已經登入fb會員
}

function logIntoFb() {
  if (facebookToken.access_token == "") {
    FB.login(
      function (response) {
        facebookToken.access_token = response.authResponse.accessToken;
      },
      { scope: "email", auth_type: "rerequest" }
    );
  } else {
    window.location = "STYLiSH/stylish/html/profile.html";
  }
  console.log("hi");
}
