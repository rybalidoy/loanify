import { useEffect, useState, useCallback } from "react";
import {
  fetchCompanies,
  fetchCompany,
  updateCompanyStatus,
} from "../../api/company";
import {
  Box,
  Typography,
  Input,
  IconButton,
  Button,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { debounce } from "lodash";
import {
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import CompanyForm from "./CompanyForm";
import { companyStatuses } from "../../types/company";
import { companyStatusReasons } from "../../types/company";

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
  const columns = [
    {
      field: "company_id",
      headerName: "Company ID",
      flex: 1,
      // valueFormatter: (params) => params.value.toString().padStart(5, '0')
    },
    { field: "name", headerName: "Name", flex: 1 },
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  const handleFetchCompanies = async (
    { page, pageSize },
    searchValue,
    sortModel
  ) => {
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
  };

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
  };

  const handleEdit = async (row) => {
    try {
      const { data, status } = await fetchCompany(row.id);
      if (status === 200) {
        setIsEdit(true);
        setSelectedCompany(data);
        setOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch company data", error);
    }
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
    <Box height={"88vh"} display={"flex"} flexDirection={"column"}>
      <Box
        paddingY={1}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h4">Companies</Typography>
        <Box display={"flex"} alignItems={"center"}>
          <Input
            placeholder="Search"
            value={search}
            onChange={handleSearchChange}
          />
          <Button
            endIcon={<PlusIcon width={20} />}
            onClick={handleCreate}
            color="success"
            sx={{ marginLeft: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box display={"flex"} flexGrow={1}>
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
        />
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Dialog>
          <DialogTitle>
            {selectedCompany ? "Edit Company" : "Create Company"}
          </DialogTitle>
          <DialogContent>
            <Divider />
            <CompanyForm
              isEdit={isEdit}
              company={selectedCompany}
              onClose={handleClose}
              onSuccess={() =>
                handleFetchCompanies(paginationModel, search, sortModel)
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Companies;
