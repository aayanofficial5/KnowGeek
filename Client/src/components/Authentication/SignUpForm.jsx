import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import FLname from "./FLname";
import Password from "./Password";
import { ACCOUNT_TYPE } from "../../utils/constant";
import { apiConnector } from "../../services/apiConnector";
import { useDispatch } from "react-redux";
import {setSignupData} from "../../slices/authSlice"
import { auth } from "../../services/apiCollection";
import { setLoading } from "../../slices/authSlice";

export const sendOtp = async (email,dispatch) => {
  
  console.log(email);
  try {
    dispatch(setLoading(true));
    const response = await apiConnector(
      "POST",
      auth.sendOTP,
      {
        email,
      }
    );
    console.log("OTP Sent Response:", response.data);
    if (response?.data?.success) {
      toast.success(response?.data?.message);
      return 1;
    } else {
      toast.error(response?.data?.message);
      return 0;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    const errMsg = error.response?.data?.message || "Something went wrong";
    toast.error(errMsg);
    return 0;
  }
};

export default function SignUpForm() {

  const dispatch = useDispatch();
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    accountType: ACCOUNT_TYPE.STUDENT,
    firstName: "Aadi",
    lastName: "Patel",
    email: "aayanofficial5@gmail.com",
    password: "Aadi@op5",
    confirmPassword: "Aadi@op5",
  });
  

  function handleLoginData(event) {
    const { name, value } = event.target;
    setLoginFormData((pState) => ({ ...pState, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if(loginFormData.password !== loginFormData.confirmPassword){
      toast.error("Passwords do not match");
      return;
    }
    // console.log(loginFormData);
    dispatch(setSignupData(loginFormData));
    const res = await sendOtp(loginFormData.email,dispatch);
    if(res===1){
      await navigate("/email-verification");
    }
    await dispatch(setLoading(false));
  }

  function handleAccountType(event) {
    setLoginFormData((pState) => ({
      ...pState,
      accountType: event.target.name,
    }));
  }

  return (
    <div className="container">
      <div className="flex gap-1 bg-gray-800 h-14 w-[225px] items-center justify-center rounded-4xl px-1 mb-5">
        <button
          name={ACCOUNT_TYPE.STUDENT}
          onClick={handleAccountType}
          className={`py-[10px] px-5 rounded-3xl transition-all duration-500 ease-in-out cursor-pointer ${
            loginFormData.accountType === ACCOUNT_TYPE.STUDENT
              ? "bg-blue-500"
              : "bg-transparent text-gray-500"
          }`}
        >
          {ACCOUNT_TYPE.STUDENT}
        </button>
        <button
          name={ACCOUNT_TYPE.INSTRUCTOR}
          onClick={handleAccountType}
          className={`py-[10px] px-5 rounded-3xl transition-all duration-500 ease-in-out cursor-pointer ${
            loginFormData.accountType !== ACCOUNT_TYPE.STUDENT
              ? "bg-blue-500"
              : "bg-transparent text-gray-500"
          }`}
        >
          {ACCOUNT_TYPE.INSTRUCTOR}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <FLname
            nameType="firstName"
            name="First Name"
            handleLoginData={handleLoginData}
            loginFormData={loginFormData}
          ></FLname>
          <FLname
            nameType="lastName"
            name="Last Name"
            handleLoginData={handleLoginData}
            loginFormData={loginFormData}
          ></FLname>
        </div>
        <br />
        <label htmlFor="email">
          Email Address<sup className="text-red-500 text-[16px] relative -top-1 -right-0.5">*</sup>
          <input
            className="w-full h-12 p-3 rounded-lg mt-1 mb-3 text-[15px]"
            onChange={handleLoginData}
            required
            type="email"
            id="email"
            name="email"
            placeholder="Enter email address"
            value={loginFormData.email}
          />
        </label>
        <br />
        <div className="flex gap-3">
          <Password
            passwordType="password"
            passwordName="Password"
            name="p1"
            handleLoginData={handleLoginData}
            showP={showP1}
            setShowP={setShowP1}
            loginFormData={loginFormData}
          ></Password>
          <Password
            passwordType="confirmPassword"
            passwordName="Confirm Password"
            name="p2"
            handleLoginData={handleLoginData}
            showP={showP2}
            setShowP={setShowP2}
            loginFormData={loginFormData}
          ></Password>
        </div>
        <button
      className={`flex flex-row gap-2 items-center w-min-fit w-full justify-center transition-all duration-200 ease-in hover:scale-95 mt-8 px-4 py-2 cursor-pointer rounded-lg border-blue-500 border-3 font-semibold bg-blue-500 text-lg`}
      type="submit"
      >Create Account
    </button>
      </form>
    </div>
  );
}
