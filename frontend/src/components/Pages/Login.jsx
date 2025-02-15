import "../../styles/Login.css";
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";

function Login() {
  return (
    <>
      <NavBar></NavBar>
      <div className="login-wrapper">
        <h2>Login</h2>
        <form method="post" action="서버의url" id="login-form">
          <input type="text" name="userName" placeholder="Email" />
          <input type="password" name="userPassword" placeholder="Password" />
          <label htmlFor="remember-check">
            <input type="checkbox" id="remember-check" /> 아이디 저장하기
          </label>
          <input type="submit" value="Login" />
        </form>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Login;
