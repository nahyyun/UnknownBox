import Component from "../../core/Component.js";

const DELIVERY_CHARGE = 3000;

export default class PaymentInfo extends Component {
  template() {
    const orderProducts = this.getOrderProductsText(this.props);
    const productsTotalPrice = this.getProductsTotalPrice(this.props);
    const orderTotalPrice = productsTotalPrice + DELIVERY_CHARGE;

    return `<div class="container">
      <h2>결제정보<h2>
      <dl>
        <div>
          <dt>주문상품</dt>
          ${orderProducts}
        </div>
        <div>
          <dt>상품총액</dt>
          <dd>${productsTotalPrice.toLocaleString()}원</dd>
        </div>
        <div>
          <dt>배송비</dt>
          <dd>${DELIVERY_CHARGE.toLocaleString()}원</dd>
        </div>
      </dl>
      <dl>
        <dt>총 결제금액</dt>
        <dd>${orderTotalPrice.toLocaleString()}원</dd>
      </dl>
      <button type="button">결제하기</button>
    </div>`;
  }

  render() {
    this.target.insertAdjacentHTML("beforeend", this.template());
  }

  getOrderProductsText(products) {
    const [firstProduct] = products;

    return products.length === CART.INIT_QUANTITY
      ? `<dd>${firstProduct.name} / 1개</dd>`
      : `<dd>${firstProduct.name} 외 ${
          products.length - CART.EXCEPT_UNIT
        }개</dd>`;
  }

  getProductsTotalPrice(products) {
    return products.reduce(
      (prev, { price, quantity }) => prev + price * quantity,
      0
    );
  }
}
