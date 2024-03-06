import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Account from "../components/Account";
import Users from "../components/Users";
import { BACKEND_URL } from "../constants";
import axios from "axios";

function DashboardPage() {
  const [username,setUsername] = useState("")
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    async function getDetail() {
      try {
        const response = await axios.get(
          BACKEND_URL + "/api/v1/account/balance",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        if (!response.data.success) {
          throw new Error("error getting balance");
        }
        console.log(response.data.data);
        const data = response.data.data;
        setUsername(data.username)
        setBalance(data.accounts[0].balance)
      } catch (error) {
        console.log(error);
      }
    }
    getDetail();
  }, [username,balance]);

  return (
    <>
      <Header username={username} />
      <main className="grid sm:grid-cols-2 lg:w-8/12 m-auto ">
        <Account balance={balance} />
        <Users username={username}/>
      </main>
      <Outlet />
    </>
  );
}

export default DashboardPage;
