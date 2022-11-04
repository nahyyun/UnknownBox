import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import * as CART from "../constants/cart.js";

class Store {
  constructor() {
    this.store = localStorage;
    this.store.setItem("cart", JSON.stringify([]));
  }

  getCartList() {
    return JSON.parse(this.store.getItem("cart"));
  }

  setCartList(product) {
    this.store.setItem("cart", JSON.stringify(product));
    return true;
  }

  setCartItem(product) {
    if (this.checkDuplication(product)) {
      return false;
    }

    const { price } = product;
    const cartList = this.getCartList();

    const newCartList = [
      ...cartList,
      { ...product, id: uuidv4(), quantity: CART.INIT_QUANTITY, total: price }
    ];

    this.store.setItem("cart", JSON.stringify(newCartList));
    return true;
  }

  checkDuplication(product) {
    const cartList = this.getCartList();

    const checkedNameCartList = cartList.filter(
      cartItem => cartItem.name === product.name
    );

    const isDuplication = checkedNameCartList.some(cartItem => {
      const productOptions = Object.values(product.options);
      const cartItemOptions = Object.values(cartItem.options);

      for (let i = 0; i < productOptions.length; i += 1) {
        if (productOptions[i] === cartItemOptions[i]) {
          return true;
        }
      }
    });

    if (isDuplication) {
      return true;
    }

    return false;
  }
}

const cart = new Store();

export { cart };