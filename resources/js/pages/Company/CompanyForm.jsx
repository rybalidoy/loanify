import { Box, TextField, Typography, Button, Grid } from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { z } from "zod";
import { create } from "../../api/company";

const CompanyForm = ({ isEdit = false, company, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: company?.name || "",
    company_code: company?.company_code || "",
    capital: company?.capital || 0,
  });

  const [errors, setErrors] = useState({});

  const schema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    company_code: z.string().min(1, "Company code is required"),
    capital: z
      .number()
      .min(0, "Capital cannot be negative")
      .max(1_000_000_000_000_000, "Capital cannot exceed 1 quadrillion"),
  });

  const handleCapitalChange = (e) => {
    const value = e.target.value.replace(/,/g, "");

    if (!/^\d*$/.test(value) || parseFloat(value) > 1_000_000_000_000_000) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        capital: "Invalid capital value. Must be a number and cannot exceed 1 quadrillion.",
      }));
      return;
    }

    setErrors((prevErrors) => ({ ...prevErrors, capital: "" }));

    setFormData((prevData) => ({
      ...prevData,
      capital: parseFloat(value) || 0,
    }));
  };

  const handleFormChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
  
    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }
  
    try {
      const validatedData = result.data;

      if (isEdit) {
        
      } else {
        await create({
          ...validatedData,
        });
      }
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      marginTop={4}
      padding={'0 4px'}
    >
      {/* Company Name Field */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography>Company Name</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            value={formData.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
      </Grid>

      {/* Company Code Field */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography>Company Code</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            value={formData.company_code}
            onChange={(e) => handleFormChange("company_code", e.target.value)}
            error={!!errors.company_code}
            helperText={errors.company_code}
          />
        </Grid>
      </Grid>

      {/* Capital Field */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Typography>Capital</Typography>
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            fullWidth
            value={formData.capital.toLocaleString()}
            onChange={handleCapitalChange}
            error={!!errors.capital}
            helperText={errors.capital}
          />
        </Grid>
      </Grid>

      {/* Form Actions */}
      <Box display={"flex"} justifyContent={"flex-end"} gap={2} mt={2}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {isEdit ? "Save Changes" : "Create Company"}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyForm;