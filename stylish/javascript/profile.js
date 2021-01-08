let fetchFbData;

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
      console.log(response);
      console.log("hello");
      if (response.status === "connected") {
        facebookToken.access_token = response.authResponse.accessToken;
        fetch("https://api.appworks-school.tw/api/1.0/user/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(facebookToken),
        })
          .then(function (response) {
            return response.json();
          })
          .then(function (returnCheckData) {
            console.log("hello there");
            console.log(returnCheckData);
            fetchFbData = returnCheckData;

            document.querySelector(".name").innerText =
              "姓名：" + fetchFbData.data.user.name;
            document.querySelector(".email").innerText =
              "Email: " + fetchFbData.data.user.email;
            document.querySelector(".fbImg").style.backgroundImage = `url(
          ${fetchFbData.data.user.picture}
        )`;
          });
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
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".logoutBtn").addEventListener("click", logOut);

  function logOut() {
    console.log("hweui");
    FB.logout(function (response) {
      facebookToken = {
        provider: "facebook",
        access_token: "",
      };
      window.location = "./index.html";
    });
  }
});
