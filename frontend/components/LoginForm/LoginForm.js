import { postLogin } from "../../apis/index.js";
import Component from "../../core/Component.js";
import { emailValidation, passwordValidation, qs } from "../../utils/index.js";

class LoginForm extends Component {
  template() {
    return `<form id="loginForm" method="POST">
              <label for="email">이메일</label>
              <input type="text" id="email" name="email"/>
              <label for="password">비밀번호</label>
              <input type="password" id="password" name="password"/>
              <input type="submit" id="loginBtn" value="로그인"/>
            </form>
            <button id="signInBtn">회원가입하기</button>
            <button id="logoutBtn">로그아웃하기</button>`;
  }

  setEvent() {
    qs("#signInBtn").addEventListener("click", () => {
      window.location = "/signin";
    });

    qs("#loginForm").addEventListener("submit", e => {
      this.handleLogin(e);
    });

    qs("#logoutBtn").addEventListener("click", e => {
      this.handleLogout(e);
    });
  }

  handleLogout(e) {
    e.preventDefault();

    function deleteCookie(token) {
      document.cookie = token + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    }
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  }

  handleLogin(e) {
    e.preventDefault();
    const [email, password] = Array.from(e.target).map(item => item.value);

    if (emailValidation(email) && passwordValidation(password)) {
      const loginData = {
        email,
        password
      };
      postLogin(loginData);
    }
  }
}

export default LoginForm;