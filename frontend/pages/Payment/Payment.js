import Component from "../../core/Component.js";
import PaymentInfo from "../../components/PaymentInfo/PaymentInfo.js";
import {
  detailAddressValidation,
  nameValidation,
  phoneValidation,
  qs,
  qsAll
} from "../../utils/index.js";
import Form from "../../components/Form/Form.js";
import { cart } from "../../store/cart.js";
import { postPayment } from "../../apis/index.js";
import style from "./payment.css" assert { type: "css" };
document.adoptedStyleSheets.push(style);

export class Payment extends Component {
  setup() {
    this.state = {
      cartList: cart.getCartList(),
      buttonEvent: this.handleClickPayment.bind(this)
    };
  }

  template() {
    return `<section id="payment_container">
      <h2 class="payment_title">주문 결제</h2>
      <div class="payment_content"></div>
    </section>`;
  }

  mounted() {
    const formChildren = [
      {
        id: "orderName",
        title: "주문자명",
        type: "text"
      },
      {
        id: "orderPhone",
        title: "주문자 전화번호",
        type: "text"
      },
      { type: "address" }
    ];
    const formProps = {
      formChildren,
      orderAddress: {
        postcode: "123123",
        roadAddress: "사랑시 고백구 행복동",
        jibunAddress: "사랑시 고백구 행복동",
        detailAddress: "상세한주소",
        extraAddress: "이건뭐이야"
      }
    };
    new Form(qs(".payment_content"), formProps);
    new PaymentInfo(qs(".payment_content"), this.state);
  }

  handleClickPayment(event) {
    const { target } = event;
    const clickedElClassName = target.classList.value;

    if (clickedElClassName !== "paymentInfo_button") {
      return;
    }

    const product = {
      productName: this.parsePaymentProductName(".paymentInfo_product-name"),
      productNum: this.parsePaymentProductQuantity(
        ".paymentInfo_product-quantity"
      ),
      productsPrice: this.parsePaymentPriceInfo(".paymentInfo_product-price"),
      deliveryPrice: this.parsePaymentPriceInfo(".paymentInfo_delivery-price"),
      orderPrice: this.parsePaymentPriceInfo(".paymentInfo_total-price")
    };
    this.handleEditBtn(event, product);
  }

  parsePaymentProductName(selector) {
    return Array.from(qsAll(selector)).map(product => {
      const [productName] = product.innerText.split(",");

      return productName;
    });
  }

  parsePaymentProductQuantity(selector) {
    return Array.from(qsAll(selector)).map(product => {
      const [productQuantityText] = product.innerText.split("개");

      return Number(productQuantityText);
    }, 0);
  }

  parsePaymentPriceInfo(selector) {
    const regex = /\d/g;

    return Number(qs(selector).innerText.match(regex).join(""));
  }

  handleEditBtn(event, product) {
    event.preventDefault();
    if (
      nameValidation(qs("#orderName")) &&
      phoneValidation(qs("#orderPhone")) &&
      detailAddressValidation(qs("#detailAddress"))
    ) {
      postPayment(Form.getFormData(), this.props, product);
      return (window.location = "/order/recipt");
    }
  }
}
