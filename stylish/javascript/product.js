// // 取得URL後面的參數 再抓到key名稱是id的值
let urlParameter = new URLSearchParams(location.search);
let id = urlParameter.get("id");
let orderNumber;

let selectNumber = document.querySelector(".number");
let chosenStock;
let selectColor;
let selectSize;

let Data;
let variants;
let colorsName;

// localStorage data variable
let cartData = {
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
      time: "morning" | "afternoon" | "anytime",
    },
    list: [],
  },
  stock: "",
};

// 取得URL相對應的 fetch 出資料 頁面要印出來
fetch(`https://api.appworks-school.tw/api/1.0/products/details?id=${id}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (productData) {
    createProdctBoxAppend(productData);
  });

// 生出資料的格子
function createProdctBoxAppend(productData) {
  let contentWrapper = document.querySelector(".contentWrapper");

  let content = document.createElement("div");
  content.classList.add("content");

  let productMainPicture = document.createElement("img");
  productMainPicture.classList.add("productMainPicture");
  productMainPicture.src = productData.data.main_image;
  content.appendChild(productMainPicture);

  let information = document.createElement("div");
  information.classList.add("information");
  content.appendChild(information);

  let title = document.createElement("div");
  title.classList.add("productTitle");
  title.innerHTML = productData.data.title;
  information.appendChild(title);

  let id = document.createElement("div");
  id.classList.add("id");
  id.innerHTML = productData.data.id;
  information.appendChild(id);

  let price = document.createElement("div");
  price.classList.add("price");
  price.innerHTML = "TWD." + productData.data.price;
  information.appendChild(price);

  let titleline = document.createElement("div");
  titleline.classList.add("titleLine");
  information.appendChild(titleline);

  let colors = document.createElement("div");
  colors.classList.add("colors");
  colors.classList.add("text");
  colors.innerHTML = "顏色 ｜";
  information.appendChild(colors);

  for (let z = 0; z < productData.data.colors.length; z++) {
    let color = document.createElement("div");
    color.classList.add("color");
    color.style.backgroundColor = "#" + productData.data.colors[z].code;
    color.value = productData.data.colors[z].code;
    // console.log(color.value);
    colors.appendChild(color);
  }

  let sizes = document.createElement("div");
  sizes.classList.add("sizes");
  sizes.classList.add("text");
  sizes.innerHTML = "尺寸 ｜";
  information.appendChild(sizes);

  for (let s = 0; s < productData.data.sizes.length; s++) {
    let size = document.createElement("button");
    size.classList.add("size");
    size.classList.add("cursor");
    size.innerHTML = productData.data.sizes[s];
    sizes.appendChild(size);
  }

  let stock = document.createElement("div");
  stock.classList.add("stock");
  stock.classList.add("text");
  stock.innerHTML = "數量 ｜";
  information.appendChild(stock);

  let stockBox = document.createElement("div");
  stockBox.classList.add("stockBox");
  stock.appendChild(stockBox);

  let minus = document.createElement("div");
  minus.classList.add("minus");
  minus.classList.add("cursor");
  minus.innerHTML = "-";
  minus.setAttribute("onclick", "minus()");
  stockBox.appendChild(minus);

  let number = document.createElement("div");
  number.classList.add("number");
  number.innerHTML = "1";
  stockBox.appendChild(number);

  let plus = document.createElement("div");
  plus.classList.add("plus");
  plus.classList.add("cursor");
  plus.innerHTML = "+";
  plus.setAttribute("onclick", "plus()");
  stockBox.appendChild(plus);

  let addtocart = document.createElement("div");
  addtocart.classList.add("addtocart");
  addtocart.innerHTML = "加入購物車";
  addtocart.setAttribute("onclick", "addToCart()");
  addtocart.setAttribute("style", "cursor:pointer");
  information.appendChild(addtocart);

  let textBlock = document.createElement("div");
  textBlock.classList.add("textBlock");
  information.appendChild(textBlock);

  let note = document.createElement("div");
  note.classList.add("note");
  note.innerHTML = productData.data.note;
  textBlock.appendChild(note);

  let texture = document.createElement("div");
  texture.classList.add("texture");
  texture.innerHTML = productData.data.texture;
  textBlock.appendChild(texture);

  let description = document.createElement("div");
  description.classList.add("description");
  description.innerHTML = productData.data.description;
  textBlock.appendChild(description);

  let wash = document.createElement("div");
  wash.classList.add("wash");
  wash.innerHTML = productData.data.wash;
  textBlock.appendChild(wash);

  let place = document.createElement("div");
  place.classList.add("place");
  place.innerHTML = productData.data.place;
  textBlock.appendChild(place);

  let forMore = document.createElement("div");
  forMore.classList.add("forMore");

  let forMoreText = document.createElement("div");
  forMoreText.classList.add("forMore-text");
  forMoreText.innerHTML = "更多產品資訊";
  forMore.appendChild(forMoreText);

  let forMoreline = document.createElement("div");
  forMoreline.classList.add("forMore-line");
  forMore.appendChild(forMoreline);

  let story = document.createElement("div");
  story.classList.add("story");
  story.innerHTML = productData.data.story;

  let images = document.createElement("div");
  images.classList.add("images");

  for (let x = 0; x < productData.data.images.length; x++) {
    let img = document.createElement("img");
    img.classList.add("img");
    img.src = productData.data.images[x];
    images.appendChild(img);
  }

  contentWrapper.appendChild(content);
  contentWrapper.appendChild(forMore);
  contentWrapper.appendChild(story);
  contentWrapper.appendChild(images);

  // 先回圈取資料出來
  // assign到變數存取做function

  for (let c = 0; c < colors.children.length; c++) {
    let chosenColor;
    chosenColor = document.querySelector(".colors").children[c];
    chosenColor.setAttribute("onclick", "chosenColorDo(this)");
  }

  for (let s = 0; s < sizes.children.length; s++) {
    let chosenSize;
    chosenSize = document.querySelector(".sizes").children[s];
    chosenSize.setAttribute("onclick", "chosenSizeDo(this)");
  }

  Data = productData.data;
  variants = productData.data.variants;
  colorsName = productData.data.colors;
  preSetFirst();
}

function chosenColorDo(clickElement) {
  let colors = document.querySelector(".colors").children;
  let sizes = document.querySelector(".sizes").children;

  for (let z = 0; z < colors.length; z++) {
    colors[z].style.border = "solid 1px #828282";
  }

  for (let s = 0; s < sizes.length; s++) {
    sizes[s].className = "size";
  }

  clickElement.style.border = "solid 3px #3A3A3A";
  selectColor = clickElement;

  selectNumber = 1;
  document.querySelector(".number").innerHTML = selectNumber;
  checkSizeDisabled();
  document.querySelector(".size:not(.disabled)").className = "size abled";
}

function chosenSizeDo(clickElement) {
  let sizes = document.querySelector(".sizes").children;
  for (let s = 0; s < sizes.length; s++) {
    sizes[s].className = "size";
  }
  clickElement.className = " size abled";
  selectSize = clickElement;
  selectNumber = 1;
  document.querySelector(".number").innerHTML = selectNumber;
  checkSizeDisabled();
  selectStock();
}

function selectStock() {
  for (let q = 0; q < variants.length; q++) {
    if (
      selectColor.value == variants[q].color_code &&
      selectSize.innerHTML == variants[q].size
    ) {
      chosenStock = variants[q].stock;
    }
  }
}

function plus() {
  if (selectNumber < chosenStock) {
    selectNumber++;
  }
  document.querySelector(".number").innerHTML = selectNumber;
}

function minus() {
  if (selectNumber > 1) {
    selectNumber--;
  }
  document.querySelector(".number").innerHTML = selectNumber;
}

function checkSizeDisabled() {
  for (let z = 0; z < variants.length; z++) {
    if (
      selectColor.value === variants[z].color_code &&
      variants[z].stock === 0
    ) {
      let sizes = document.querySelector(".sizes").children;

      for (let s = 0; s < sizes.length; s++) {
        if (sizes[s].innerHTML === variants[z].size) {
          sizes[s].className = "size disabled";
        }
      }
    }
  }
}

function preSetFirst() {
  document.querySelector(".color").style.border = "solid 3px #3A3A3A";
  selectColor = document.querySelector(".color");
  checkSizeDisabled();
  document.querySelector(".size:not(.disabled)").className = "size abled";
  selectSize = document.querySelector(".size:not(.disabled)");
  selectNumber = 1;
  selectStock();
}

function addToCart() {
  let listItem = {
    id: "",
    mainImage: "",
    name: "",
    price: "",
    color: {
      name: "",
      code: "",
    },
    size: "",
    qty: "",
    stock: "",
  };

  if (localStorage.cart) {
    cartData = JSON.parse(localStorage.getItem("cart"));
  }
  let done = false;
  for (let i = 0; i < colorsName.length; i++) {
    if (selectColor.value == colorsName[i].code) {
      listItem.color.name = colorsName[i].name;
    }
  }

  listItem.id = Data.id;
  listItem.mainImage = Data.main_image;
  listItem.name = Data.title;
  listItem.price = Data.price;
  listItem.color.code = selectColor.value;
  listItem.size = document.querySelector(".abled").innerHTML;
  listItem.qty = selectNumber;
  listItem.stock = chosenStock;

  if (cartData.order.list.length === 0) {
    cartData.order.list.push(listItem);
  } else {
    for (let c = 0; c < cartData.order.list.length; c++) {
      if (
        cartData.order.list[c].id === Data.id &&
        cartData.order.list[c].color.code === selectColor.value &&
        cartData.order.list[c].size === selectSize.innerHTML
      ) {
        cartData.order.list[c].qty = selectNumber;

        done = true;
      }
    }
    if (!done) {
      cartData.order.list.push(listItem);
      console.log(cartData.order.list);
    }
  }
  localStorage.setItem("cart", JSON.stringify(cartData));

  let data;
  let dataFromStorage;
  let cartNumber;

  // if(localStorage.cart)

  data = localStorage.getItem("cart");
  dataFromStorage = JSON.parse(data);
  cartNumber = dataFromStorage.order.list.length;

  document.querySelector(".cartCircle-mobile").innerHTML = cartNumber;
  document.querySelector(".cartCircle").innerHTML = cartNumber;
  alert("已加入購物車");
}
