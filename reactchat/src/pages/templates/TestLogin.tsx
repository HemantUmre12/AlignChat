import useAuthService from "../../services/AuthService";

const TestLogin = () => {
  const { isLoggedIn, logout } = useAuthService();
  return (
    <>
      <p>Test Login</p>
      <p>{isLoggedIn ? "true" : "false"}</p>
      <input type="button" value="logout" onClick={() => logout()}></input>
    </>
  );
};

export default TestLogin;
