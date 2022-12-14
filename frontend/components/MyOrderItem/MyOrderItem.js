import { deleteOrderInfo } from "../../apis/index.js";
import Component from "../../core/Component.js";
import { qs, qsAll } from "../../utils/index.js";
import MyOrderItemBox from "../MyOrderItemBox/MyOrderItemBox.js";
import style from "./myOrderItem.css" assert { type: "css" };
document.adoptedStyleSheets.push(style);

class MyOrderItem extends Component {
  template() {
    const { item, idx, deleteOrder } = this.props;
    const parsedDate = item.createdAt.split("T")[0];
    return `<div id="myorderitem-container">
              <span class="myorderitem-order-time">${parsedDate} 주문</span>
              <div class="myorderitem-product-section">
                <div class="myorderitem-product-list">
                </div>
                <div class="myorderitem-product-status">
                  <span>총 ${item.totalPrice.toLocaleString()}원</span>
                  <span>상태 : ${item.state}</span>
                  <button class="myorder-edit-btn" ${
                    item.state === "박스 미오픈" || item.state === "배송 준비중"
                      ? ""
                      : "disabled"
                  }>배송정보 수정</button>
                  <button class="myorder-delete-btn" ${
                    item.state === "박스 미오픈" || item.state === "배송 준비중"
                      ? ""
                      : "disabled"
                  }>주문 취소</button>
                </div>
              </div>
            </div>`;
  }

  mounted() {
    this.props.item.randomboxes.forEach((randombox, boxIdx) => {
      new MyOrderItemBox(qsAll(".myorderitem-product-list")[this.props.idx], {
        item: randombox,
        parentIdx: this.props.idx,
        boxIdx
      });
    });
  }

  render() {
    this.target.insertAdjacentHTML("beforeend", this.template());
    this.mounted();
  }

  setEvent() {
    qsAll(".myorder-edit-btn")[this.props.idx].addEventListener("click", e => {
      window.location = `/mypage/order/${this.props.item.orderId}`;
    });

    qsAll(".myorder-delete-btn")[this.props.idx].addEventListener(
      "click",
      e => {
        this.handleDeleteBtn(e);
      }
    );
  }

  handleDeleteBtn(e) {
    e.preventDefault();
    deleteOrderInfo(this.props.item.orderId);
    this.props.deleteOrder(this.props.item.orderId);
  }
}

export default MyOrderItem;
