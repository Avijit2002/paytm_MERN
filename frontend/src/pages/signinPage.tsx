import { useState } from "react";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { zodSigninSchema } from "@avijit2002/zodvalidationandtypes";
import { signinType } from "@avijit2002/zodvalidationandtypes";

import { BACKEND_URL } from "../constants";
import FormInput from "../components/FormInput";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";

function SigninPage() {

  const navigate = useNavigate()

  const [sigInFormData, setSignInFormData] = useState<signinType>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  //console.log(errors);

  async function handleSubmit(e: any) {
    e.preventDefault();

    const val = zodSigninSchema.safeParse(sigInFormData);

    if (!val.success) {
      setErrors({
        username: val.error.format().username?._errors[0] as string,
        password: val.error.format().password?._errors[0] as string,
      });
      return;
    } else {
      try {
        const res = await axios({
          method: "post",
          url: BACKEND_URL + "/api/v1/user/signin",
          data: val.data,
        });

        if (res.data.success) {
          localStorage.setItem("token", "Bearer " + res.data.token);
          toast(res.data.message);
          navigate("/dashboard")
        }
      } catch (error:any) {
        console.log(error)
        //console.log(error.response.data.message);
        toast.error(error.response.data.message);
      }

      setErrors({
        username: "",
        password: "",
      });

      setSignInFormData({
        username: "",
        password: "",
      });
    }
  }
  //console.log(validation.result.error.format())

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-400 h-screen grid place-content-center">
        <Form type="sign in" handleSubmit={handleSubmit}>
          <FormInput
            label="username"
            placeholder="avijit2002"
            value={sigInFormData.username}
            onchange={(e) =>
              setSignInFormData((sigInFormData) => {
                return {
                  ...sigInFormData,
                  username: e.target.value,
                };
              })
            }
            error={errors.username}
          />
          <FormInput
            type="password"
            label="Password"
            value={sigInFormData.password}
            onchange={(e) =>
              setSignInFormData((sigInFormData) => {
                return {
                  ...sigInFormData,
                  password: e.target.value,
                };
              })
            }
            error={errors.password}
          />
        </Form>
      </div>
    </>
  );
}

export default SigninPage;
