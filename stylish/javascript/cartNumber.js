let data;
let dataFromStorage;
let cartNumber;

// if(localStorage.cart)
if (localStorage.cart) {
  data = localStorage.getItem("cart");
  dataFromStorage = JSON.parse(data);
  cartNumber = dataFromStorage.order.list.length;
} else {
  cartNumber = 0;
}

// data = localStorage.getItem("cart");
// dataFromStorage = JSON.parse(data);
// cartNumber = dataFromStorage.order.list.length;

document.querySelector(".cartCircle-mobile").innerHTML = cartNumber;
document.querySelector(".cartCircle").innerHTML = cartNumber;
