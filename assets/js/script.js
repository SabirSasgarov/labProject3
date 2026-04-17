let productsCache = [];

function initCarouselIfAvailable(selector, options = {}) {
  if (
    window.jQuery &&
    jQuery.fn &&
    typeof jQuery.fn.owlCarousel === "function"
  ) {
    const $carousel = jQuery(selector);
    if (!$carousel.length) {
      return;
    }

    if ($carousel.hasClass("owl-loaded")) {
      $carousel.trigger("destroy.owl.carousel");
      $carousel.removeClass("owl-loaded");
      $carousel.find(".owl-stage-outer").children().unwrap();
    }

    $carousel.owlCarousel({
      margin: 16,
      nav: true,
      dots: true,
      loop: true,
      autoplay: true,
      autoplayTimeout: 1500,
      autoplayHoverPause: true,
      smartSpeed: 550,
      navText: ["&#10094;", "&#10095;"],
      responsive: {
        0: { items: 1 },
        640: { items: 2 },
        992: { items: 3 },
        1200: { items: 4 },
      },
      ...options,
    });

    $carousel.trigger("play.owl.autoplay", [2000]);
  }
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}...`;
}

function showLoading() {
  jQuery("#products").html("<p>Loading...</p>");
}

function updateCount() {
  const data = JSON.parse(localStorage.getItem("myArray")) || [];
  jQuery("#item-counter-in-basket").text(data.length);
}

function addToBasket(product) {
  let data = JSON.parse(localStorage.getItem("myArray")) || [];
  let existingIndex = -1;

  for (let i = 0; i < data.length; i++) {
    const item = JSON.parse(data[i]);
    if (item.title === product.title) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex !== -1) {
    const existingItem = JSON.parse(data[existingIndex]);
    existingItem.count += 1;
    data[existingIndex] = JSON.stringify(existingItem);
  } else {
    const newItem = {
      title: product.title,
      description: product.description,
      price: `$${product.price}`,
      img: product.image,
      count: 1,
    };
    data.push(JSON.stringify(newItem));
  }

  localStorage.setItem("myArray", JSON.stringify(data));
  updateCount();
}

function showProductInfo(product) {
  jQuery("#modal-product-image").attr("src", product.image || "");
  jQuery("#modal-product-image").attr("alt", product.title || "Product image");
  jQuery("#modal-product-category").text(product.category || "No category");
  jQuery("#modal-product-title").text(product.title || "Product");
  jQuery("#modal-product-description").text(product.description || "No description available.");
  jQuery("#modal-product-price").text(`$${product.price}`);

  jQuery("#product-info-modal").addClass("open").attr("aria-hidden", "false");
  jQuery("body").addClass("modal-open");
}

function closeProductInfoModal() {
  jQuery("#product-info-modal").removeClass("open").attr("aria-hidden", "true");
  jQuery("body").removeClass("modal-open");
}

function renderProducts(products) {
  const $products = jQuery("#products");
  $products.empty();

  products.forEach((product, index) => {
    const cardHtml = `
      <div class="product-item" data-product-index="${index}">
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.title}" />
          <div class="card-body">
            <h5 class="card-title">${truncateText(product.title, 45)}</h5>
            <p class="card-text description">${truncateText(product.description, 100)}</p>
            <p class="card-text">Price: $<span class="price">${product.price}</span></p>
            <div class="card-actions">
              <button class="order-btn" type="button">Order Now</button>
              <button class="info-btn" type="button">Info</button>
            </div>
          </div>
        </div>
      </div>
    `;

    $products.append(cardHtml);
  });

  initCarouselIfAvailable("#products");
}

jQuery(function () {
  updateCount();
  showLoading();

  jQuery
    .getJSON("https://fakestoreapi.com/products")
    .done(function (products) {
      productsCache = products;
      renderProducts(productsCache);
    })
    .fail(function () {
      jQuery("#products").html("<p>Products could not be loaded.</p>");
    });

  jQuery("#products").on("click", ".order-btn", function () {
    const index = jQuery(this).closest(".product-item").data("product-index");
    const product = productsCache[index];
    if (product) {
      addToBasket(product);
    }
  });

  jQuery("#products").on("click", ".info-btn", function () {
    const index = jQuery(this).closest(".product-item").data("product-index");
    const product = productsCache[index];
    if (product) {
      showProductInfo(product);
    }
  });

  jQuery("#basket-btn").on("click", function () {
    window.location.href = "basket.html";
  });

  jQuery("#modal-close-btn").on("click", function () {
    closeProductInfoModal();
  });

  jQuery("#product-info-modal").on("click", function (event) {
    if (event.target === this) {
      closeProductInfoModal();
    }
  });

  jQuery(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      closeProductInfoModal();
    }
  });
});
