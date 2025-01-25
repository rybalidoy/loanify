import React, { useState } from "react";
import { Card, CardContent, Typography, TextField, Button, Box } from "@mui/material";
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
    company_code: z.string().nonempty("Company Code is required"), // Add company_code validation
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords must match",
    path: ["password_confirmation"],
  });

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    company_code: "", // Add company_code to formData
  });

  const [errors, setErrors] = useState({
    username: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    company_code: "", // Add company_code to errors
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
      company_code: "", // Reset company_code error
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
        company_code: fieldErrors.company_code?.[0] || "", // Set company_code error
      }));
      return;
    }

    handleRegistration(formData);
  };

  const handleRegistration = async (data) => {
    const response = await register(data);

    if (response?.ok) {
      // Handle successful registration
      console.log("Registration successful");
    } else {
      // Handle backend errors
      setErrors((prev) => ({
        ...prev,
        backend: response?.data?.message || "Registration failed",
      }));
    }
  };

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
            variant="h4"
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
            <TextField
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleInputChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
            />
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              error={!!errors.first_name}
              helperText={errors.first_name}
              fullWidth
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              error={!!errors.last_name}
              helperText={errors.last_name}
              fullWidth
            />
            <TextField
              name="middle_name"
              label="Middle Name (Optional)"
              value={formData.middle_name}
              onChange={handleInputChange}
              error={!!errors.middle_name}
              helperText={errors.middle_name}
              fullWidth
            />
            <TextField
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              name="password"
              type="password"
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              fullWidth
            />
            <TextField
              name="password_confirmation"
              type="password"
              label="Repeat Password"
              value={formData.password_confirmation}
              onChange={handleInputChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              fullWidth
            />
            <TextField
              name="company_code"
              label="Company Code"
              value={formData.company_code}
              onChange={handleInputChange}
              error={!!errors.company_code}
              helperText={errors.company_code}
              fullWidth
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
            {errors.backend && (
              <Typography
                variant="body2"
                color="error"
                sx={{ mt: 2, textAlign: "center" }}
              >
                {errors.backend}
              </Typography>
            )}
          </Box>
          <Typography
            variant="body2"
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