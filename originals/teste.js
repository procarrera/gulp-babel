window.onload = function () {
    console.log(
      "\n ================== \n LOADED FILE CUSTOM.JS {v4.0.0} \n ================== \n"
    );
  
    document.querySelectorAll('[id^="button-up-"]').forEach((element) => {
      element.addEventListener("click", handleItemIncrease);
    });
    document.querySelectorAll('[id^="button-down-"]').forEach((element) => {
      element.addEventListener("click",  handleItemDecrease);
    });
  };
  
  export const AddToCartButton = `<button class="quick-add-button" type="submit" tabindex="0">Add To Cart</button>`;
  
  export function handleItemIncrease(e) {
    const variant_id = e.target.parentNode.id;
    console.log(variant_id);
    handleQuantitySelector(variant_id, "+");
  }
  
  export async function getCart() {
    const response = await fetch("/cart.js", {
      headers: {
        "Content-Type": "application/json",
        pragma: "no-cache",
        "cache-control": "no-cache",
      },
      credentials: "same-origin",
    });
    const data = await response.json();
    return data;
  }
  
  export function  handleItemDecrease(e) {
    const variant_id = e.target.parentNode.id;
    console.log(variant_id);
    handleQuantitySelector(variant_id, "-");
  }
  
  export function handleQuantityZero(variant_id) {
    $(`#${variant_id}`).toggleClass("no-background");
    $(`#${variant_id}`).children().addClass("hide");
    $(`#${variant_id}`).append(AddToCartButton);
  }
  
  const CART_UPDATE_EVENT = "wetheme-cart-update";
  const updateCartDrawer = (cart) => {
    const event = new CustomEvent(CART_UPDATE_EVENT, {
      detail: {
        cart,
      },
    });
    document.documentElement.dispatchEvent(event);
  };
  
  async function handleQuantitySelector(variant_id, action) {
    const parent = document.getElementById(variant_id);
    const oldQuantity = parseInt(parent.children[1].textContent);
  
    let newQuantity = 0;
  
    const updates = {};
  
    if (action === "+") {
      newQuantity = parseInt(oldQuantity + 1);
      updates[parseInt(variant_id)] = parseInt(oldQuantity + 1);
    } else {
      newQuantity = parseInt(oldQuantity - 1);
      updates[parseInt(variant_id)] = parseInt(oldQuantity - 1);
    }
  
    jQuery // Update Cart with new quantity
      .post("/cart/update.js", {
        updates,
      })
      .done(function (data) {
        jQuery // Get updated cart
          .ajax({
            url: "/cart.js",
            dataType: "json",
          })
          .done(function (data) {
            updateCartDrawer(data); // Update cart drawer (header)
            if (newQuantity === 0) {
              console.log("aqui");
              handleQuantityZero(variant_id);
            }
            $(`#quantity-${variant_id}`).text(newQuantity);
          });
      });
  }
  