import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthServiceContext from "../context/useAuthServiceContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const { register } = useAuthServiceContext();
  const navigate = useNavigate();

  const handleSubmit = async (ev: React.SyntheticEvent) => {
    ev.preventDefault();
    // Set initial error values to empty
    setUsernameError("");
    setPasswordError("");

    // Check if the user has entered both fields correctly
    if ("" === username) {
      setUsernameError("Required");
      return;
    }
    if ("" === password) {
      setPasswordError("Required");
      return;
    }

    // Authentication calls
    const statusCode = await register(username, password);
    if (statusCode === 409) {
      setUsernameError("Username already exists");
    } else if (statusCode === 401) {
      console.log("Unauthorised");

      setUsernameError("Invalid username or password");
      setPasswordError("Invalid username or password");
    } else {
      navigate("/login");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          alighItems: "center",
          flexDirection: "column",
          display: "flex",
          marginTop: 8,
        }}
      >
        <Typography
          variant="h5"
          noWrap
          component="h1"
          sx={{ fontWeight: 500, pb: 2 }}
        >
          Sign up
        </Typography>

        <Box
          component="form"
          onSubmit={(ev) => handleSubmit(ev)}
          sx={{ mt: 1 }}
        >
          <TextField
            autoFocus
            fullWidth
            id="username"
            label="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            error={Boolean(usernameError)}
            helperText={usernameError}
          ></TextField>

          <TextField
            margin="normal"
            fullWidth
            id="password"
            type="password"
            label="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            autoComplete="true"
            error={Boolean(passwordError)}
            helperText={passwordError}
          ></TextField>

          <Button
            variant="contained"
            disableElevation
            type="submit"
            sx={{ mt: 1, mb: 2 }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
