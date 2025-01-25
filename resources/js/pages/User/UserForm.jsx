import React, { useState } from "react";
import { TextField, Button, Box, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { create, update } from '../../api/user';

const UserForm = ({ isEdit, user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    middle_name: user?.middle_name || "",
    password: "", // Password is only required for creation
    password_confirmation: "", // Add password confirmation field
    role: user?.role || "", // Add role field
  });

  // Define roles with their display names and backend keys
  const roles = [
    { label: "Owner", value: "owner" },
    { label: "Admin", value: "admin" },
    { label: "Payroll Officer", value: "payroll_officer" },
    { label: "Employee", value: "employee" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format data before sending
    const formattedData = {
      ...formData,
      email: formData.email.toLowerCase(),
      username: formData.username.toLowerCase(),
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      middle_name: formData.middle_name.trim(),
    };

    try {
      let response;
      if (isEdit) {
        // For editing, exclude password_confirmation if not needed
        const { password_confirmation, ...editData } = formattedData;
        response = await update(editData);
      } else {
        // For creation, include password_confirmation
        response = await create(formattedData);
      }

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="First Name"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Last Name"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Middle Name"
        name="middle_name"
        value={formData.middle_name}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required={!isEdit} // Password is required only for creation
        margin="normal"
      />
      {!isEdit && ( // Only show password confirmation for creation
        <TextField
          fullWidth
          label="Confirm Password"
          name="password_confirmation"
          type="password"
          value={formData.password_confirmation}
          onChange={handleChange}
          required
          margin="normal"
        />
      )}
      <FormControl fullWidth margin="normal">
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          {roles.map((role) => (
            <MenuItem key={role.value} value={role.value}>
              {role.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {isEdit ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;