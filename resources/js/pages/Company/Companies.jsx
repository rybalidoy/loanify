import { useEffect, useState, useCallback } from "react";
import { fetchCompanies, fetchCompany, updateCompanyStatus } from '../../api/company';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid2, IconButton, TextField, Typography, Snackbar } from "@mui/material";
import { debounce } from "lodash";
import { CheckCircleIcon, PencilIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@mui/x-data-grid";
import CompanyForm from "./CompanyForm";
import { companyStatuses, companyStatusReasons } from "../../types/company";

const Companies = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const [companies, setCompanies] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [search, setSearch] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "name", sort: "asc" }]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const columns = [
    {
      field: "company_code",
      headerName: "Code",
      flex: 1,
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "current_status", headerName: "Status", flex: 1},
    { field: "capital", headerName: "Capital", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          height="100%"
        >
          <IconButton onClick={() => handleEdit(params.row)}>
            <PencilIcon width={24} />
          </IconButton>
          <IconButton onClick={() => handleToggle(params.row)}>
            {params.row.current_status === companyStatuses.inactive ? (
              <CheckCircleIcon width={24} color="green" />
            ) : (
              <XCircleIcon width={24} color="red" />
            )}
          </IconButton>
        </Box>
      ),
    },
  ];

  const debounceSearch = useCallback(
    debounce((value) => {
      handleFetchCompanies(paginationModel, value, sortModel);
    }, 1000),
    [paginationModel, sortModel]
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    debounceSearch(event.target.value);
  };

  const handleFetchCompanies = async ({ page, pageSize }, searchValue, sortModel) => {
    console.log(page, pageSize, searchValue, sortModel);
    const { field, sort } = sortModel[0];
    const params = {
      page: page + 1,
      pageSize,
      search: searchValue,
      sortField: field,
      sortDirection: sort,
    };

    const { data, status } = await fetchCompanies(params);

    if (status === 200) {
      setCompanies(data?.data);
      setTotalRows(data?.total);
    } else {
      setCompanies([]);
    }
  };

  const handlePaginationModelChange = (newPaginationModel) => {
    setPaginationModel(newPaginationModel);
    handleFetchCompanies(newPaginationModel, search, sortModel); // Fetch companies on pagination change
  };

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
    handleFetchCompanies(paginationModel, search, newSortModel); // Fetch companies on sort change
  };

  const handleEdit = async (row) => {
    setIsEdit(true);
    setSelectedCompany(row);
    setOpen(true);
  };

  const handleToggle = async (row) => {
    const status =
      row.current_status === companyStatuses.active
        ? companyStatuses.inactive
        : companyStatuses.active; // Invert the status
    const statusReason =
      status === companyStatuses.active
        ? companyStatusReasons.enabled
        : companyStatusReasons.disabled;
    const response = await updateCompanyStatus(row.id, {
      status: status,
      reason: statusReason,
    });
    if (response.status === 200) {
      console.log(response?.data.message);
      handleFetchCompanies(paginationModel, search, sortModel);
      setSnackbarMessage(response?.data.message);
      setSnackbarOpen(true);
    }
  };

  const handleCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setSelectedCompany(null);
  };

  useEffect(() => {
    handleFetchCompanies(paginationModel, search, sortModel);
  }, [paginationModel, sortModel]);

  return (
    <Grid2 container display="flex" justifyContent="space-between" gap={2} height={'calc(100vh - 165px)'}>
      <Typography variant="h5">Companies</Typography>
      <Box display="flex" alignItems="center" width={'40%'}>
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            variant={'outlined'}
            placeholder="Search"
            value={search}
            size="small"
            onChange={handleSearchChange}
          />
        </Box>
        <Button
          variant="contained"
          endIcon={<PlusIcon width={20} />}
          onClick={handleCreate}
          sx={{ marginLeft: 2 }}
        >
          Create
        </Button>
      </Box>
      <Box display="flex" sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          columns={columns}
          rows={companies}
          pagination
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[25, 50, 100]}
          onSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          disableRowSelectionOnClick
          sx={{ flexGrow: 1 }}
        />
      </Box>
    
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCompany ? "Edit Company" : "Create Company"}
        </DialogTitle>
        <DialogContent>
          <Divider />
          <CompanyForm
            isEdit={isEdit}
            company={selectedCompany}
            onClose={handleClose}
            onSuccess={() => {
              handleFetchCompanies(paginationModel, search, sortModel);
              handleClose();
            }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Grid2>
  );
};

export default Companies;