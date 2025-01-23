import { useState } from "react";

const Users = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
    total: 0
  });

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortModel, setSortModel] = useState([{ field: "last_name", sort: "asc"}]);
  const [selectedUser, setSelectedUser] = useState(null);

  

  return (
    <div>Users</div>
  );
}

export default Users;