import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { apiConnector } from "../services/apiConnector";
import { auth } from "../services/apiCollection";
import { toast } from "react-hot-toast";
import { sendOtp } from "../components/Authentication/SignUpForm";
import { useDispatch } from "react-redux";
import { setLoading } from "../slices/authSlice";
import Loading from "./Components/Loading";
const EmailVerification = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const signupData = useSelector((state) => state.auth.signupData);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isDisabled, setIsDisabled] = useState(true);
  const createAccount = async ({
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    otp,
  }) => {
    try {
      dispatch(setLoading(true));
      const response = await apiConnector("POST", auth.signup, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      });
      // console.log("Account Creation Response:", response.data);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        return 1;
      } else {
        toast.error(response?.data?.message);
        return 0;
      }
    } catch (error) {
      console.error("Account Creation Error:", error);
      const errMsg = error.response?.data?.message || "Something went wrong";
      toast.error(errMsg);
      return 0;
    }
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else {
      setIsDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  const resendOtpHandler = async () => {
    await sendOtp(signupData.email);
    setIsDisabled(true);
    setTimeLeft(30);
  };

  useEffect(()=>{
    if(!signupData){
      navigate("/signup");
    }
  },[])

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(otp);
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = signupData;
    const res = await createAccount({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    });
    if (res === 1) {
      navigate("/login");
    }
    dispatch(setLoading(false));
  };

  return (
    <div className="flex justify-center items-center text-white w-full h-[80vh] text-3xl">
      {loading ? (
        <div class="flex justify-center items-center h-[70vh]">
        <Loading/>
      </div>
      ) : (
      <div className="w-[50%] md:w-[30%] flex flex-col gap-4 justify-center items-center">
        <h1 className="font-semibold opacity-85 text-yellow-400 self-start">
          Verify Email
        </h1>
        <p className="text-lg opacity-60">
          A verification code has been sent to you. Enter the code below
        </p>
        <form>
          <OtpInput
            value={otp}
            onChange={(value) => setOtp(value)}
            numInputs={6}
            renderSeparator={<span className="opacity-0">----</span>}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                className=" rounded-lg border-1 border-gray-300 h-10 text-center text-4xl text-white"
              />
            )}
          />
          <button
            className="text-xl h-10 w-full bg-blue-500 rounded-lg my-6 cursor-pointer font-semibold"
            onClick={handleFormSubmit}
          >
            Submit
          </button>
        </form>
        <div className="text-base flex justify-between w-full">
          <div
            className="flex items-center"
            onClick={() => navigate("/signup")}
          >
            <IoIosArrowRoundBack className="text-gray-100 text-3xl cursor-pointer" />
            <span className="cursor-pointer text-gray-100">Back To Signup</span>
          </div>

          <span
            onClick={!isDisabled ? resendOtpHandler : null}
            className={`flex items-center gap-1 text-sm mt-2 font-medium transition ${
              isDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-400 cursor-pointer hover:text-blue-500"
            }`}
          >
            <FaArrowRotateLeft className="text-sm" />
            {isDisabled ? `Resend in ${timeLeft} sec` : "Resend"}
          </span>
        </div>
      </div>
      )}
    </div>
  );
};

export default EmailVerification;
