let cartData;
let cartDataFromStorage;
let orderNumber;
let receiver = document.querySelector(".receiver");
let email = document.querySelector(".email");
let phoneNumber = document.querySelector(".phoneNumber");
let receiveAddress = document.querySelector(".receiveAddress");
let subtotal = document.querySelector(".totalAmount");
let accountPayable = document.querySelector(".accountPayable");

let payCheckData = {
  order: {
    shipping: "",
    payment: "",
    subtotal: "",
    freight: "",
    total: "",
    recipient: {
      name: [],
      phone: [],
      email: [],
      address: [],
      time: "",
    },
    list: "",
  },
  prime: "",
};

if (
  localStorage.cart &&
  JSON.parse(localStorage.getItem("cart")).order.list.length > 0
) {
  cartData = localStorage.getItem("cart");
  cartDataFromStorage = JSON.parse(cartData);

  renderElement();
} else {
  document.querySelector(".shoppingContentWrapper").innerHTML =
    "<h3>購物車空空的沒有東西唷！</h3>";
}
console.log(cartDataFromStorage);

// 判斷localstorage 的內容是空時 顯示文字購物車x是空的
// else印東西

// 購物車數量要改 當刪除時

// 小計 重新跑出時印出小計
// 找undified的東西

function renderElement() {
  for (let l = 0; l < cartDataFromStorage.order.list.length; l++) {
    let shoppingContent = document.createElement("div");
    shoppingContent.classList.add("shoppingContent");

    let shoppingContentWrapper = document.querySelector(
      ".shoppingContentWrapper"
    );
    shoppingContentWrapper.appendChild(shoppingContent);

    let mainPictureTextWrapper = document.createElement("div");
    mainPictureTextWrapper.classList.add("mainPictureTextWrapper");
    shoppingContent.appendChild(mainPictureTextWrapper);

    let mainPicture = document.createElement("div");
    mainPicture.classList.add("mainPicture");
    mainPicture.style.backgroundImage = `url(
    ${cartDataFromStorage.order.list[l].mainImage}
  )`;
    mainPictureTextWrapper.appendChild(mainPicture);

    let mainText = document.createElement("div");
    mainText.classList.add("mainText");
    mainText.innerHTML =
      cartDataFromStorage.order.list[l].name +
      "<br>" +
      cartDataFromStorage.order.list[l].id +
      "<br>" +
      "<br>" +
      "顏色：" +
      cartDataFromStorage.order.list[l].color.name +
      "<br>" +
      "尺寸：" +
      cartDataFromStorage.order.list[l].size;
    mainPictureTextWrapper.appendChild(mainText);

    let amountBtn = document.createElement("div");
    amountBtn.classList.add("amountBtn");
    shoppingContent.appendChild(amountBtn);

    let qtyMobile = document.createElement("div");
    qtyMobile.classList.add("qtyMobile");
    qtyMobile.innerHTML = "數量";
    amountBtn.appendChild(qtyMobile);

    let select = document.createElement("select");
    select.classList.add("selectBuyNumber");
    select.classList.add([l]);
    select.setAttribute("onchange", "changeDataNumber(this)");
    select.setAttribute("style", "cursor:pointer");
    amountBtn.appendChild(select);

    for (let i = 0; i < cartDataFromStorage.order.list[l].stock; i++) {
      let option = document.createElement("option");
      option.classList.add("option");
      option.textContent = i + 1;
      select.appendChild(option);
    }

    document.querySelectorAll(".option")[
      cartDataFromStorage.order.list[l].qty - 1
    ].selected = true;

    for (let i = 0; i < cartDataFromStorage.order.list[l].stock; i++) {
      let option = document.querySelector(".option");
      option.classList.remove("option");
    }

    let priceWrapper = document.createElement("div");
    priceWrapper.classList.add("price");
    shoppingContent.appendChild(priceWrapper);

    let priceMobile = document.createElement("div");
    priceMobile.classList.add("priceMobile");
    priceMobile.innerHTML = "單價";
    priceWrapper.appendChild(priceMobile);

    let price = document.createElement("div");
    price.classList.add("priceTag");
    price.innerHTML = "NT." + cartDataFromStorage.order.list[l].price;
    priceWrapper.appendChild(price);

    let priceMutiWrapper = document.createElement("div");
    priceMutiWrapper.classList.add("price");
    shoppingContent.appendChild(priceMutiWrapper);

    let priceMutiMobile = document.createElement("div");
    priceMutiMobile.classList.add("priceMutiMobile");
    priceMutiMobile.innerHTML = "小計";
    priceMutiWrapper.appendChild(priceMutiMobile);

    let priceMuti = document.createElement("div");
    priceMuti.classList.add("priceMuti");
    priceMutiWrapper.appendChild(priceMuti);

    let gerbage = document.createElement("div");
    gerbage.classList.add("gerbage");
    gerbage.classList.add([l]);
    gerbage.setAttribute("onclick", "trash(this)");
    gerbage.setAttribute("style", "cursor:pointer");
    shoppingContent.appendChild(gerbage);

    let gerbageImg = document.createElement("img");
    gerbageImg.src = "../images/cart-remove.png";
    gerbage.appendChild(gerbageImg);
  }
  eachTotal();
  total();
}

// 加判斷是

// 尾巴算總金額 並且置入HTML
function total() {
  let totalAmount = 0;
  let accountPayable;

  for (let i = 0; i < document.querySelectorAll(".priceMuti").length; i++) {
    totalAmount += parseInt(
      document.querySelectorAll(".priceMuti")[i].innerText.split("NT.")[1]
    );
  }
  accountPayable = totalAmount + 60;

  document.querySelector(".totalAmount").innerText = "NT." + totalAmount;
  document.querySelector(".accountPayable").innerText = "NT." + accountPayable;
}

// 計算每一個物件的小計 並且置入HTML
function eachTotal() {
  for (let l = 0; l < cartDataFromStorage.order.list.length; l++) {
    let result =
      cartDataFromStorage.order.list[l].qty *
      cartDataFromStorage.order.list[l].price;
    document.querySelectorAll(".priceMuti")[l].innerText = "NT." + result;
  }
}

function changeDataNumber(item) {
  console.log(item.value);
  let NoNumber = parseInt(item.className.split("selectBuyNumber")[1]);
  cartDataFromStorage.order.list[NoNumber].qty = item.value;
  localStorage.setItem("cart", JSON.stringify(cartDataFromStorage));

  let result = item.value * cartDataFromStorage.order.list[NoNumber].price;
  document.querySelectorAll(".priceMuti")[NoNumber].innerText = "NT." + result;

  total();
}

function trash(item) {
  let NoNumber = parseInt(item.className.split("gerbage")[1]);
  alert(`${cartDataFromStorage.order.list[NoNumber].name} 已從購物車刪除`);
  cartDataFromStorage.order.list.splice(NoNumber, 1);
  localStorage.setItem("cart", JSON.stringify(cartDataFromStorage));

  document.querySelector(".shoppingContentWrapper").innerHTML = "";

  renderElement();
  eachTotal();
  total();

  if (JSON.parse(localStorage.getItem("cart")).order.list.length === 0) {
    document.querySelector(".shoppingContentWrapper").innerHTML =
      "<h3>購物車空空的沒有東西唷！</h3>";
    cartNumber = 0;
    document.querySelector(".cartCircle-mobile").innerHTML = cartNumber;
    document.querySelector(".cartCircle").innerHTML = cartNumber;
  } else if (JSON.parse(localStorage.getItem("cart")).order.list.length > 0) {
    cartNumber = JSON.parse(localStorage.getItem("cart")).order.list.length;
    document.querySelector(".cartCircle-mobile").innerHTML = cartNumber;
    document.querySelector(".cartCircle").innerHTML = cartNumber;
  }
}

// Tap Pay 信用卡

TPDirect.setupSDK(
  "12348",
  "app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF",
  "sandbox"
);

TPDirect.card.setup({
  // Display ccv field
  fields: {
    number: {
      // css selector
      element: "#card-number",
      placeholder: "**** **** **** ****",
    },
    expirationDate: {
      // DOM object
      element: document.getElementById("card-expiration-date"),
      placeholder: "MM / YY",
    },
    ccv: {
      element: "#card-ccv",
      placeholder: "ccv",
    },
  },
  styles: {
    // Style all elements
    input: {
      color: "gray",
    },
    // Styling ccv field
    "input.ccv": {
      // 'font-size': '16px'
    },
    // Styling expiration-date field
    "input.expiration-date": {
      // 'font-size': '16px'
    },
    // Styling card-number field
    "input.card-number": {
      // 'font-size': '16px'
    },
    // style focus state
    ":focus": {
      // 'color': 'black'
    },
    // style valid state
    ".valid": {
      color: "green",
    },
    // style invalid state
    ".invalid": {
      color: "red",
    },
    // Media queries
    // Note that these apply to the iframe, not the root window.
    "@media screen and (max-width: 400px)": {
      input: {
        color: "orange",
      },
    },
  },
});

let checkBtn = document.querySelector(".payCheck");
checkBtn.addEventListener("click", checkPayment);

function checkPayment(event) {
  event.preventDefault();

  if (receiver.value == "") {
    alert("請填寫收件人姓名");
    return;
  }

  if (email.value == "") {
    alert("請填寫Email");
    return;
  }

  if (phoneNumber.value == "") {
    alert("請填寫手機號碼");
    return;
  }

  if (receiveAddress.value == "") {
    alert("請填寫收件地址");
    return;
  }

  if (TPDirect.card.getTappayFieldsStatus().canGetPrime == false) {
    alert("請填寫正確的信用卡資訊");
    return;
  }

  TPDirect.card.getPrime((result) => {
    if (result.status !== 0) {
      alert("信用卡資料有誤 請修改");
      return;
    }
    payCheckData.prime = result.card.prime;

    //   確認內容資料

    payCheckData.order.shipping = "delivery";
    payCheckData.order.payment = "credit_card";
    payCheckData.order.subtotal = parseInt(subtotal.innerText.split("NT.")[1]);
    payCheckData.order.freight = 60;
    payCheckData.order.total = parseInt(
      accountPayable.innerText.split("NT.")[1]
    );
    payCheckData.order.recipient.name = receiver.value;
    payCheckData.order.recipient.phone = phoneNumber.value;
    payCheckData.order.recipient.email = email.value;
    payCheckData.order.recipient.address = receiveAddress.value;

    for (let i = 0; i < 3; i++) {
      if (document.querySelectorAll(".inputPoint")[i].checked == true) {
        payCheckData.order.recipient.time = document.querySelectorAll(".time")[
          i
        ].innerText;
      }
    }
    payCheckData.order.list = JSON.parse(
      localStorage.getItem("cart")
    ).order.list;

    alert("訂單已送出");

    fetch("https://api.appworks-school.tw/api/1.0/order/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${facebookToken.access_token}`,
      },
      body: JSON.stringify(payCheckData),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (returnCheckData) {
        orderNumber = returnCheckData.data.number;
        localStorage.clear();
        window.location = `./thankyou.html?number=${orderNumber}`;
      });
  });
}
