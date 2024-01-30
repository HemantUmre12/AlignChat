import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthServiceContext from "../context/useAuthServiceContext";

const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const navigate = useNavigate();

  const { login } = useAuthServiceContext();
  const handleSubmit = async () => {
    // Set initial error values to empty
    setUsernameError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === username) {
      setUsernameError("Please enter your username");
      return;
    }
    if ("" === password) {
      setPasswordError("Please enter a password");
      return;
    }

    // Authentication calls will be made here...
    try {
      await login(username, password);
      navigate("/testLogin");
    } catch (error) {
      return error;
    }
  };

  return (
    <div>
      <div>
        <div>Login</div>
      </div>
      <br />
      <div>
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <label>{usernameError}</label>
      </div>
      <br />
      <div>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <label>{passwordError}</label>
      </div>
      <br />
      <div>
        <input type="button" onClick={handleSubmit} value={"Log in"} />
      </div>
    </div>
  );
};

export default Login;
