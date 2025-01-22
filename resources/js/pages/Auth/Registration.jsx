import React, { useState } from "react";
import { Card, CardContent, Typography, Input, Button, Box } from "@mui/material";
import { z } from "zod";
import { Link } from "react-router-dom";
import { register } from "../../api/auth";

const registrationSchema = z
  .object({
    username: z.string().nonempty("User Name is required"),
    first_name: z.string().nonempty("First Name is required"),
    last_name: z.string().nonempty("Last Name is required"),
    middle_name: z.string().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

const Registration = () => {
  const [formData, setFormData] = useState({
    usename: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    backend: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      username: "",
      first_name: "",
      last_name: "",
      middle_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      backend: "",
    });

    const validation = registrationSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors((prev) => ({
        ...prev,
        username: fieldErrors.username?.[0] || "",
        first_name: fieldErrors.first_name?.[0] || "",
        last_name: fieldErrors.last_name?.[0] || "",
        middle_name: fieldErrors.middle_name?.[0] || "",
        email: fieldErrors.email?.[0] || "",
        password: fieldErrors.password?.[0] || "",
        password_confirmation: fieldErrors.password_confirmation?.[0] || "",
      }));
      return;
    }

    handleRegistration(formData);
  };

  const fakeBackendRegister = async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 1000);
    });
  };

  const handleRegistration = async (data) => {
    const response = await register(data);

    console.log(response);
    if (response?.ok) {
      
    }
    setFormData([]);
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "60%",
          minHeight: "600px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          boxShadow: "lg",
          padding: 0,
          outline: "none",
        }}
      >
        {/* Left Column - Image Placeholder */}
        <Box
          sx={{
            backgroundColor: "#e0e0e0",
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
          <Typography
            level="h4"
            component="div"
            sx={{ mb: 2, textAlign: "center" }}
          >
            Register
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
            <Input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
            />
            {errors.username && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.username}
              </Typography>
            )}
            <Input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
            />
            {errors.first_name && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.first_name}
              </Typography>
            )}
            <Input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
            />
            {errors.last_name && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.last_name}
              </Typography>
            )}
            <Input
              name="middle_name"
              placeholder="Middle Name (Optional)"
              value={formData.middle_name}
              onChange={handleInputChange}
              error={!!errors.middle_name}
            />
            <Input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
            />
            {errors.email && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.email}
              </Typography>
            )}
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.password}
              </Typography>
            )}
            <Input
              name="password_confirmation"
              type="password"
              placeholder="Repeat Password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              error={!!errors.password_confirmation}
            />
            {errors.password_confirmation && (
              <Typography level="body2" color="error" sx={{ mt: -1 }}>
                {errors.password_confirmation}
              </Typography>
            )}
            <Button type="submit" fullWidth color="primary">
              Register
            </Button>
            {errors.backend && (
              <Typography
                level="body2"
                color="error"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {errors.backend}
              </Typography>
            )}
          </Box>
          <Typography
            level="body2"
            sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
          >
            Already have an account?{" "}
            <Link to="/login" replace>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Registration;
