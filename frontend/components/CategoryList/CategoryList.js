import Component from "../../core/Component.js";
import CategoryItem from "../CategoryItem/CategoryItem.js";
import { isClassContained, MODAL, qs } from "../../utils/index.js";
import {
  getCategoryList,
  addCategory,
  editCategory,
  deleteCategory
} from "../../apis/index.js";
import Modal from "../Modal/Modal.js";
import style from "./categoryList.css" assert { type: "css" };
document.adoptedStyleSheets.push(style);

export default class CategoryList extends Component {
  template() {
    return `<button type="button" class="category-addBtn">추가하기</button>
            <ul class="admin_category-list"></ul>`;
  }

  async mounted() {
    const list = await getCategoryList();
    this.state = { category: list };

    this.state.category.forEach(({ categoryId, categoryName }) => {
      new CategoryItem(qs(".admin_category-list"), {
        categoryId,
        categoryName,
        editCategoryName: this.editCategoryName.bind(this),
        deleteCategoryName: this.deleteCategoryName.bind(this)
      });
    });
  }

  setEvent() {
    this.target.addEventListener("click", e => {
      if (!isClassContained(e.target, "category-addBtn")) return;
      new Modal(qs("#app"), {
        headerText: "카테고리 추가",
        type: "ADD",
        contents: {
          body: [
            MODAL.Form({}, [
              MODAL.Input({ type: "text", name: "categoryName" })
            ])
          ]
        },
        submit: this.addCategoryName.bind(this)
      });
    });
  }

  async addCategoryName(data) {
    await addCategory(data);
    location = "/admin";
  }

  async editCategoryName(id, data) {
    await editCategory(id, data);
    location = "/admin";
  }

  async deleteCategoryName(id) {
    await deleteCategory(id);
    const remain = this.state.category.filter(
      category => category.categoryId !== id
    );
    this.setState({ category: remain });
  }
}
