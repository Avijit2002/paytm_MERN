import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import UserList from "./UserList";

function Users({username}:{username:string}) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await axios.get(BACKEND_URL+`/api/v1/user/bulk?filter=${query}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        if (response.data.success) {
          console.log(response.data.data)
          setUsers(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, [query]);
  return (
    <div className="my-10 mx-5 py-5 px-6 bg-gray-100 rounded-md h-2/3 overflow-auto">
     
      <h1 className="text-2xl font-semibold text-center mb-4">Users</h1>
      <SearchBar query={query} setQuery={setQuery} />
      <div>
        <UserList data={users} username={username}/>
      </div>
    </div>
  );
}

export default Users;
