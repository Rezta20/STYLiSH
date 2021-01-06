//________________________________________________________________________________
//宣吿（抓）URL的參數 後面key是tag 的值
let urlParameter = new URLSearchParams(location.search);
let tag = urlParameter.get("tag");
//________________________________________________________________________________
// 預設主頁loading 進入paging=0, productParam = "all",宣告變數
// 變數放外面才可以兩個function都吃到
let paging = 0;
let productParam = "all";

// 設一個避免fetch抓資料回傳多次的判別式開關
let fetchToggle = false;
//________________________________________________________________________________
//＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
// 一開啟畫面，顯現出首頁輪播圖,所有產品的首頁
fetch("https://api.appworks-school.tw/api/1.0/marketing/campaigns")
  .then(function (response) {
    return response.json();
  })
  .then(function (coverpicturedata) {
    creatCoverPicture(coverpicturedata);
  });

// 生格子，串連封面產品圖片的API
//控制輪播圖 點點的功能
function creatCoverPicture(coverpicture) {
  let coverCarousel = document.querySelector(".coverCarousel");

  for (let l = 0; l < coverpicture.data.length; l++) {
    let coverPicture = document.createElement("div");
    let coverPictureAlink = document.createElement("a");

    coverPicture.classList.add("coverpicture");
    coverPictureAlink.classList.add("coverPictureAlink");

    coverPicture.setAttribute(
      "style",
      `background-image: url('${coverpicture.data[l].picture}')`
    );
    coverPictureAlink.setAttribute(
      "href",
      `product.html?id=${coverpicture.data[l].product_id}`
    );

    coverPictureAlink.appendChild(coverPicture);
    coverCarousel.appendChild(coverPictureAlink);

    let story = document.createElement("div");
    story.classList.add("story");
    story.innerText = coverpicture.data[l].story;
    coverPicture.appendChild(story);
  }

  let dotHome = document.createElement("div");
  dotHome.classList.add("dotHome");
  coverCarousel.appendChild(dotHome);

  for (let q = 0; q < coverpicture.data.length; q++) {
    let dot = document.createElement("div");
    dot.classList.add("dot");
    dotHome.appendChild(dot);
  }

  // 首張圖片先出現
  let coverPictureTag = document.querySelectorAll(".coverpicture");
  let dotTag = document.querySelectorAll(".dot");

  // 確認第[0]張顯現 其他張消失coverpicture.data.length
  // 確認點點顏色 全部先反黑 再被點選的反白
  for (let a = 0; a < coverpicture.data.length; a++) {
    coverPictureTag[a].style.opacity = "0";
    coverPictureTag[a].style.zIndex = "0";
    coverPictureTag[0].style.opacity = "1";
    coverPictureTag[0].style.zIndex = "5";

    dotTag[a].style.backgroundColor = "#F2F6FB";
    dotTag[0].style.backgroundColor = "#5B5B5B";
  }

  //3秒後 哪張圖片會消失 哪張圖片會出現
  //判斷 當圖片跑到總圖片數列長度時 位置歸零 重新跑入迴圈
  let coverHide = 0;
  let coverShow = 1;
  let dotHide = 0;
  let dotShow = 1;

  // 選到點點家 當點點家的第d個孩子被點擊時
  // 第d張圖片和顏色顯示

  for (let d = 0; d < dotHome.children.length; d++) {
    dotHome.children[d].onclick = function chooseDot() {
      coverShow = d;
      dotShow = d;

      for (let r = 0; r < dotHome.children.length; r++) {
        coverPictureTag[r].style.opacity = "0";
        coverPictureTag[d].style.zIndex = "0";
        dotTag[r].style.backgroundColor = "#F2F6FB";
        // coverPictureAlink[r].removeChild("coverPictureAlink");
      }
      coverPictureTag[d].style.opacity = "1";
      coverPictureTag[d].style.zIndex = "5";
      dotTag[d].style.background = "#5B5B5B";
      // coverCarousel.appendChild("coverPictureAlink")[d];
    };
  }

  // 幾秒後圖片會出現跟消失，opacity 圖片還在 只是透明隱藏
  // opacity的值介於0~1之間
  setInterval(() => {
    coverPictureTag[coverHide].style.opacity = "0";
    coverPictureTag[coverShow].style.opacity = "1";
    coverPictureTag[coverHide].style.zIndex = "0";
    coverPictureTag[coverShow].style.zIndex = "5";
    coverHide++;
    coverShow++;
    if (coverHide == coverpicture.data.length) {
      coverHide = 0;
    }
    if (coverShow == coverpicture.data.length) {
      coverShow = 0;
    }
  }, 3000);

  // 幾秒後點點會出現跟消失，opacity 圖片還在 只是透明隱藏
  // opacity的值介於0~1之間
  setInterval(() => {
    dotTag[dotHide].style.backgroundColor = "#F2F6FB";
    dotTag[dotShow].style.backgroundColor = "#5B5B5B";
    dotHide++;
    dotShow++;
    if (dotHide == dotTag.length) {
      dotHide = 0;
    }
    if (dotShow == dotTag.length) {
      dotShow = 0;
    }
  }, 3000);
}
//________________________________________________________________________________
//________________________________________________________________________________
//顯示頁面
// 判斷如果URL query string  是空的時候 頁面是顯現/products/all的資料
if (detectQueryString() === false) {
  tag = "all";
}
//判斷當query string 的tag不是women,men,accessories,all的情況時
//tag 會回傳 到search的api
if (tag != "women" && tag != "men" && tag != "accessories" && tag != "all") {
  productSearchApi();
} else {
  fetchHomePage(tag);
}

function productSearchApi() {
  fetch(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${tag}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (product) {
      // 判斷文字回傳是否為空, 找不到資料回傳的介面
      if (product.data.length == 0) {
        // 清除原本存在的content資料, 改成輸出“請搜尋其他關鍵字”
        document.querySelector(".contentWrapper").innerHTML = "";
        document.querySelector(".contentWrapper").innerHTML =
          "<h3>請搜尋其他關鍵字</h3>";
      } else {
        // 清除原本存在的content資料, 生出新element 資料append
        document.querySelector(".contentWrapper").innerHTML = "";
        creatAppendElement(product);
      }
    });
}

function fetchHomePage(item) {
  fetchToggle = false;
  fetch(`https://api.appworks-school.tw/api/1.0/products/${item}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector(".contentWrapper").innerHTML = "";
      paging = 0;
      productParam = item;
      // 判斷API中是否有next_paging這個key
      // 如果"沒有"的條件成立，畫面顯示空
      if ("next_paging" in data === false) {
      }
      //顯現出資料
      creatAppendElement(data);
    });
}

//判斷URL 是不是字串為空
function detectQueryString() {
  var currentQueryString = window.location.search;

  if (currentQueryString) {
    return true;
  } else {
    return false;
  }
}

//生格子createElement，appnd API資料進格子
function creatAppendElement(data) {
  for (let k = 0; k < data.data.length; k++) {
    let contentWrapper = document.querySelector(".contentWrapper");

    let content = document.createElement("div");
    content.classList.add("content");

    let link = document.createElement("a");
    link.classList.add("productAlink");
    link.setAttribute("href", `product.html?id=${data.data[k].id}`);
    content.appendChild(link);

    let img = document.createElement("img");
    img.classList.add("contentPicture");
    img.src = data.data[k].main_image;
    link.appendChild(img);

    let div = document.createElement("div");
    div.classList.add("colors");
    content.appendChild(div);

    for (let i = 0; i < data.data[k].colors.length; i++) {
      let color = document.createElement("div");
      color.classList.add("color");
      color.style.backgroundColor = "#" + data.data[k].colors[i].code;
      div.appendChild(color);
    }
    content.appendChild(div);

    // contentText wrapper
    let divText = document.createElement("div");
    divText.classList.add("contentText");
    content.appendChild(divText);

    let title = document.createElement("p");
    title.innerText = data.data[k].title;
    title.classList.add("contentName");
    divText.appendChild(title);

    let price = document.createElement("p");
    price.innerHTML = "TWD." + data.data[k].price;
    price.classList.add("price");
    divText.appendChild(price);

    contentWrapper.appendChild(content);
  }
}
//________________________________________________________________________________
//________________________________________________________________________________
// 無限滾動頁面 當滑到底時 資料會再新增出現
//當滾動到底 資料會再新增進頁面
window.addEventListener("scroll", addpage);
function addpage() {
  // 從頂端計算的高度 可以滾動的高度 視窗的高度
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (clientHeight + scrollTop >= scrollHeight - 10) {
    if (fetchToggle === false) {
      fetchToggle = true;
      // paging會＋1
      paging++;
      // 連接到fetch把URL帶入參數（變數）,<span> onclick時會取得相對應的變數
      if (
        tag == "women" ||
        tag == "men" ||
        tag == "accessories" ||
        tag == "all"
      ) {
        fetch(
          `https://api.appworks-school.tw/api/1.0/products/${productParam}?paging=${paging}`
        )
          .then(function (response) {
            return response.json();
          })
          .then(function (nextpage) {
            // 判斷API中是否有next_paging這個key
            // 如果"沒有"的條件成立 畫面顯示空
            if ("next_paging" in nextpage === false) {
            }
            // 輸出nextpage中的資料，將其append到element上
            creatAppendElement(nextpage);
          });
      }
    }
  }
}
//________________________________________________________________________________
//________________________________________________________________________________
