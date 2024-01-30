import { BASE_URL } from "../../config";
import { useState } from "react";
import useAuthService from "../../services/AuthService";
import useAxiosWithInterceptor from "../../helpers/jwtinterceptor";

const TestLogin = () => {
  const { isLoggedIn, logout } = useAuthService();
  const [username, setUsername] = useState("");
  const jwtAxios = useAxiosWithInterceptor();

  const getUserDetails = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    try {
      const response = await jwtAxios.get(
        `${BASE_URL}/account/?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const userDetails = response.data;
      setUsername(userDetails.username);
    } catch (error) {
      return error;
    }
  };

  const handleGetUsername = () => {
    getUserDetails();
  };

  return (
    <>
      <p>Test Login</p>
      <p>{isLoggedIn ? "true" : "false"}</p>
      <input type="button" value="logout" onClick={() => logout()}></input>
      <p>Username: {username}</p>
      <input type="button" value="username" onClick={handleGetUsername}></input>
    </>
  );
};

export default TestLogin;
