import React, { FormEventHandler } from "react";
import { Link, useNavigate } from "react-router-dom";

interface formType {
  type: "sign up" | "sign in" | "send";
  handleSubmit: FormEventHandler;
  children: React.ReactNode;
}

function Form({ type, handleSubmit, children }: formType) {

  const navigate = useNavigate()
  let heading;
  let subHeading;
  let footerLine;
  let footerButton;
  let footerButtonLink;

  switch (type) {
    case "sign up":
      heading = "Sign up";
      subHeading = "Enter your information to create an account";
      footerLine = "Already have account";
      footerButton = "Login";
      footerButtonLink = "/signin";
      break;
    case "sign in":
      heading = "Login";
      subHeading = "Enter your information to login";
      footerLine = "Don't have account?";
      footerButton = "Sign up";
      footerButtonLink = "/signup";
      break;
    case "send":
      heading = "Send Money";
      break;
    default:
      break;
  }

  return (
    <div className="bg-white w-[30rem] border rounded-2xl">
      <form action="submit" onSubmit={handleSubmit} className="m-7">
        <h1 className="text-center font-bold text-4xl my-5">{heading}</h1>
        {subHeading && (
          <h2 className="text-center font-medium text-2xl mt-5 mb-8 text-gray-600">
            {subHeading}
          </h2>
        )}

        {children}
        
        <button className="text-xl mt-4 w-full bg-black font-semibold text-white py-4 rounded-lg hover:bg-gray-500">
          Submit
        </button>
        {type=="send" &&  <button onClick={()=>{navigate("/")}} className="text-xl mt-4 w-full bg-black font-semibold text-white py-4 rounded-lg hover:bg-gray-500">
          Cancel
        </button>}

        {footerLine && (
          <h3 className="my-4 text-lg text-center">
            {footerLine}
            <Link className="ml-2" to={footerButtonLink as string}>
              {footerButton}
            </Link>
          </h3>
        )}
      </form>
    </div>
  );
}

export default Form;
