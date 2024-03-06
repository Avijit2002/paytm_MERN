import { useState } from "react";
import Form from "../components/Form";
import FormInput from "../components/FormInput";
import { useNavigate, useSearchParams } from "react-router-dom";

import { zodTransferSchema } from "@avijit2002/zodvalidationandtypes";
import { transferType } from "@avijit2002/zodvalidationandtypes";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { BACKEND_URL } from "../constants";

function SendMoney() {
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const to = searchParams.get("to");

  const data: transferType = {
    tousername: to as string,
    amount: amount,
  };

  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log(to);

    const validation = zodTransferSchema.safeParse(data);
    if (validation.success) {
      try {
        const response = await axios.post(
          BACKEND_URL + "/api/v1/account/transfer",
          data,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        if (response.data.success) {
          toast(response.data.message);
          console.log(response.data);
        }

        setAmount(0);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    } else {
      toast.error(validation.error.format().amount?._errors[0]);
    }
  }
  return (
    <div className="z-10 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 p-2 bg-blue-100 rounded-2xl">
      <ToastContainer />
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
