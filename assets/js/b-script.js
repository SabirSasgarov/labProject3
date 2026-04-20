let goBackButton = document.getElementById("go-back-btn");
goBackButton.addEventListener("click", function () {
  window.location.href = "index.html";
});

function emptyList() {
  let listContainer = document.getElementById("list-container");
  listContainer.innerHTML =
    "<p style='color: #6c757d; font-size: 1.25rem; text-align: center; margin: 0;'>Your basket is empty!</p>";
  let totalCostElement = document.getElementById("total-cost");
  totalCostElement.innerText = "0.00";
}

function updateList() {
  let data = JSON.parse(localStorage.getItem("myArray")) || [];
  let listContainer = document.getElementById("list-container");
  listContainer.innerHTML = "";

  if (data.length === 0) {
    emptyList();
    return;
  }

  for (let i = 0; i < data.length; i++) {
    let item = JSON.parse(data[i]);
    let listItem = document.createElement("div");
    listItem.classList.add("list-item");

    listItem.innerHTML = `
            <div>
                <img src="./assets/images/delete-2-svgrepo-com.svg" alt="Remove Item" class="remove-item" style="cursor: pointer; width: 20px; height: 20px;">
            </div>
            <div class="item-image-container">
                <img src="${item.img}" alt="${item.title}" class="item-image "> 
            </div>
            <div class="item-details">
                <h2>${item.title}</h2>
                <p>${item.description}</p>
                <p class="item-price">${item.price}</p>
            </div> 
            <div class="item-count badge text-bg-primary rounded-pill">
                <p>${item.count}</p>
            </div> 
        `;
    if (i == data.length - 1) {
      listItem.style.borderBottom = "none";
    }
    listContainer.appendChild(listItem);
  }
}

function attachRemoveListeners() {
  let removeButtons = document.querySelectorAll(".remove-item");
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener("click", function () {
      let data = JSON.parse(localStorage.getItem("myArray")) || [];
      data.splice(i, 1);
      localStorage.setItem("myArray", JSON.stringify(data));
      updateList();
      attachRemoveListeners();
      let totalCostElement = document.getElementById("total-cost");
      totalCostElement.innerText = `${totalCost()}`;
    });
  }
}

updateList();
attachRemoveListeners();

let clearListButton = document.getElementById("clear-btn");
clearListButton.addEventListener("click", function () {
  if (!localStorage.getItem("myArray")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your basket is empty!",
    });
    return;
  }
  localStorage.removeItem("myArray");
  let listContainer = document.getElementById("list-container");
  listContainer.innerHTML = "";
  emptyList();
  checkBasket();
});

let checkoutButton = document.getElementById("checkout-btn");
checkoutButton.addEventListener("click", function () {
  if (!localStorage.getItem("myArray")) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your basket is empty!",
    });
    return;
  }
  Swal.fire({
    position: "center",
    icon: "success",
    title: "Your order has been placed!",
    showConfirmButton: false,
    timer: 1500,
  });
  localStorage.removeItem("myArray");
  let listContainer = document.getElementById("list-container");
  listContainer.innerHTML = "";
  emptyList();
  checkBasket();
});

function totalCost() {
  let data = JSON.parse(localStorage.getItem("myArray")) || [];
  let total = 0;
  for (let i = 0; i < data.length; i++) {
    let item = JSON.parse(data[i]);
    let price = parseFloat(item.price.replace("$", ""));
    total += price * item.count;
  }
  return total.toFixed(2);
}

let totalCostElement = document.getElementById("total-cost");
totalCostElement.innerText = `${totalCost()}`;

checkBasket();
function checkBasket() {
  let data = JSON.parse(localStorage.getItem("myArray")) || [];
  if (data.length === 0) {
    clearListButton.style.display = "none";
    checkoutButton.style.display = "none";
  };
}