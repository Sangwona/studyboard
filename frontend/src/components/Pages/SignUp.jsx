import "../../styles/Login.css";
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";

function SignUp () {
    return (
      <>
        <NavBar></NavBar>
        <div className="login-wrapper">
          <h2>Sign Up</h2>
          <form method="post" action="서버의url" id="login-form">
            <input type="text" name="userName" placeholder="Email" />
            <input type="password" name="userPassword" placeholder="Password" />
            <input type="submit" value="Create Account" />
          </form>
        </div>
        <Footer></Footer>
      </>
    );
}

export default SignUp