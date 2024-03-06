import { useState } from "react";

import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { zodSignupSchema } from "@avijit2002/zodvalidationandtypes";
import { signupType } from "@avijit2002/zodvalidationandtypes";

import { BACKEND_URL } from "../constants";
import FormInput from "../components/FormInput";
import Form from "../components/Form";

import { useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate()
 const [signUpData, setSignUpData] = useState<signupType>({
  firstname: "",
  lastname: "",
  username: "",
  password: "",

})
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
  });

  console.log(errors);

  async function handleSubmit(e: any) {
    e.preventDefault();
    //onsole.log(formData);
    const val = zodSignupSchema.safeParse(signUpData);
    if (!val.success) {
      console.log(val.error.format().password?._errors[0]);

      setErrors({
        firstname: val.error.format().firstname?._errors[0] as string,
        lastname: val.error.format().lastname?._errors[0] as string,
        username: val.error.format().username?._errors[0] as string,
        password: val.error.format().password?._errors[0] as string,
      });
      return;
    } else {
      const res = await axios({
        method: "post",
        url: BACKEND_URL + "/api/v1/user/signup",
        data: val.data,
      });


      if(res.data.success){
        localStorage.setItem("token","Bearer "+ res.data.token)
        toast(res.data.message)
        navigate("/")
      }else{
        toast(res.data.message)
      }

      setErrors({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
      });

      setSignUpData({
        firstname: "",
        lastname: "",
        username: "",
        password: "",
      })

      //errors.password = "";
      // send to server
    }
  }
  //console.log(validation.result.error.format())

  return (
    <div className="bg-gray-400 h-screen grid place-content-center">
      <Form type="sign up" handleSubmit={handleSubmit}>
        <FormInput
          label="First name"
          placeholder="Avijit"
          value={signUpData.firstname}
          onchange={(e)=>setSignUpData(signUpData=>{
            return {
              ...signUpData,
              firstname:e.target.value
            }
          })}
          error={errors.firstname}
        />
        <FormInput
          label="Last name"
          placeholder="Ram"
          value={signUpData.lastname}
          onchange={(e)=>setSignUpData(signUpData=>{
            return {
              ...signUpData,
              lastname:e.target.value
            }
          })}
          error={errors.lastname}
        />
        <FormInput
          label="username"
          placeholder="avijit2002"
          value={signUpData.username}
          onchange={(e)=>setSignUpData(signUpData=>{
            return {
              ...signUpData,
              username:e.target.value
            }
          })}
          error={errors.username}
        />
        <FormInput
          type="password"
          label="Password"
          value={signUpData.password}
          onchange={(e)=>setSignUpData(signUpData=>{
            return {
              ...signUpData,
              password:e.target.value
            }
          })}
          error={errors.password}
        />
      </Form>
    </div>
  );
}

export default SignupPage;
