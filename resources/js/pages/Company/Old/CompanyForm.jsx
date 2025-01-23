import { Box, Input, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { z } from "zod";
import { create, getMaxCompanyId, updateCompanyStatus } from "../../../api/company";
import dayjs from 'dayjs';

const CompanyForm = ({ company, onClose, onSuccess, isEdit = false }) => {
  const [companyId, setCompanyId] = useState("");
  const [tag, setTag] = useState("");
  const [name, setName] = useState("");
  const [capital, setCapital] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      const companyId = company.company_id.substring(0, 6);
      const tag = company.company_id.substring(6);
      setCompanyId(companyId);
      setTag(tag);
      setName(company.name);
      setCapital(company.capital.toString());
    } else {
      const currentDate = dayjs().format('DDMMYY');
      setCompanyId(currentDate);
    }
  }, [company]);

  const schema = z.object({
    tag: z.string().min(5),
    name: z.string().min(3),
    capital: z.number().min(0).max(1_000_000_000_000_000),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = schema.safeParse({
      tag,
      name,
      capital: parseFloat(capital.replace(/,/g, '')),
    });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors(formattedErrors);
      return;
    }

    try {
      if (isEdit) {
        
      } else {
        const response = await create({
          tag: tag.toUpperCase(),
          name,
          capital: parseFloat(capital.replace(/,/g, '')),
        });
      }
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handleCapitalChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(value) || parseFloat(value) > 1_000_000_000_000_000) {
      return;
    }
    setCapital(value);
  };

  //  Company id is not from backend which mismatch data
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={1}
      width={300}
    >
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography>Company ID</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Input
            value={companyId}
            disabled
            sx={{
              "& input": { textAlign: "right" },
              width: "87px",
            }}
          />
          <Box component="span">-</Box>
          <Input
            value={tag}
            placeholder="Tag"
            onChange={(e) => setTag(e.target.value.slice(0, 5).toUpperCase())}
            inputProps={{ maxLength: 3 }}
            required
            sx={{ flex: 1 }}
          />
        </Box>
        {errors.tag && (
          <Typography sx={{ color: "red" }} fontSize={14} padding={1}>
            {errors.tag._errors[0]}
          </Typography>
        )}
      </Box>
      <Box display="flex" flexDirection="column" gap={0.5}>
        <Typography>Company Name</Typography>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && (
          <Typography sx={{ color: "red" }} fontSize={14} padding={1}>
            {errors.name._errors[0]}
          </Typography>
        )}
      </Box>
      <Box display="flex" flexDirection="column" gap={0.5} marginBottom={1}>
        <Typography>Capital</Typography>
        <Input
          type="text"
          value={capital}
          onChange={handleCapitalChange}
          inputProps={{ inputMode: "numeric", pattern: "[0-9,]*" }}
          required
        />
        {errors.capital && (
          <Typography sx={{ color: "red" }} fontSize={14} padding={1}>
            {errors.capital._errors[0]}
          </Typography>
        )}
      </Box>
      <Button type="submit" color="success">
        Submit
      </Button>
    </Box>
  );
};

export default CompanyForm;
