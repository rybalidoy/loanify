import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, useTheme } from "@mui/material";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required"),
});

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    backend: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "", backend: "" });
    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
      }));
      return;
    }

    handleLogin(formData);
  };

  const handleLogin = async (data) => {
    const response = await login(data);

    if (response?.data) {
      const token = response?.data?.sanctum_token;

      if (token) {
        Cookies.set("sanctum_token", token, { expires: 2 / 24, path: "" });
        return navigate("/dashboard");
      }
    }

    setErrors((prev) => ({
      ...prev,
      backend: response?.data?.message,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "60%",
          minHeight: "600px",
          maxheight: "80%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          boxShadow: theme.shadows[5], // MUI shadow usage
          padding: 0,
          outline: "none",
        }}
      >
        {/* Left Column - Image Placeholder */}
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Image Placeholder
          </Typography>
        </Box>
        {/* Right Column - Form */}
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 3,
          }}
        >
          <Typography variant="h4" component="div" sx={{ mb: 2, textAlign: "center" }}>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "80%",
              marginX: "auto",
            }}
          >
            <TextField
              name="email"
              type="email"
              label="Email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button type="submit" fullWidth color="primary" variant="contained">
              Login
            </Button>
            {errors.backend && (
              <Typography sx={{ mt: 2, textAlign: "center", color: "red" }}>
                {errors.backend}
              </Typography>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Link to="/register" replace>
              Sign up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
