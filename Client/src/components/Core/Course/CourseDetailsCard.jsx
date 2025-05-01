import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCart } from "../../../redux/slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constant"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to Clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="flex flex-col gap-4 rounded-md bg-gray-800 p-4 text-white shadow-md">
      {/* Course Thumbnail */}
      <img
        src={ThumbnailImage}
        alt={course?.courseName}
        className="w-full max-w-[400px] min-h-[180px] max-h-[300px] mx-auto rounded-2xl object-cover"
      />

      <div className="px-4">
        {/* Price */}
        <div className="text-3xl font-semibold text-white pb-4">
          ₹ {CurrentPrice}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-4 rounded transition-all duration-200"
            onClick={
              user && course?.studentsEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
          >
            {user && course?.studentsEnrolled.includes(user?._id)
              ? "Go To Course"
              : "Buy Now"}
          </button>

          {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
            <button
              onClick={handleAddToCart}
              className="bg-gray-900 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-all duration-200"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Refund Policy */}
        <p className="pt-6 pb-3 text-center text-sm text-gray-400">
          30-Day Money-Back Guarantee
        </p>

        {/* Pre-requisite */}
        <div>
          <p className="my-2 text-xl font-semibold">Tags :</p>
          <div className="flex flex-row flex-wrap gap-3 text-sm text-blue-200 underline">
            {course?.tag?.map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-300 hover:text-yellow-400 transition-all"
            onClick={handleShare}
          >
            <FaShareSquare size={15} />
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsCard
