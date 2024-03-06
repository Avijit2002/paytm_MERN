import { useState } from "react";
import Form from "../components/Form";
import FormInput from "../components/FormInput";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../constants";

function SendMoney() {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams();
  const to = searchParams.get("to");

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log(to);

    try {
      const response = await axios.post(
        BACKEND_URL + "/api/v1/account/transfer",
        {
          tousername: to,
          amount: amount,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data.success) {
        console.log(response.data);
      }

      setAmount(0)
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="z-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2 bg-blue-100 rounded-2xl">
      <Form type="send" handleSubmit={handleSubmit}>
        <FormInput
          label="Enter Amount"
          placeholder="100"
          onchange={(e) => {
            setAmount(+e.target.value); // + converts string to number
          }}
          value={amount}
        />
      </Form>
    </div>
  );
}

export default SendMoney;
