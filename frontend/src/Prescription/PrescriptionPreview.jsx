import React, { forwardRef, useState, useEffect } from "react";
import { FaPrescription } from "react-icons/fa";
import MiddleImage from "../assets/middle_image.png"
import { jwtDecode } from 'jwt-decode';

const PrescriptionPreview = forwardRef(({ formData, prescriptionId }, ref) => {
  const [user, setUser] = useState(null);
         console.log(user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const userData = decodedToken.user;
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  return (
    <div className="" ref={ref}>
      <div className="p-6 border border-gray-300 bg-white font-rubik">
        {/* Prescription Content */}
        <div className="flex justify-between mb-6 overflow-x-auto gap-2">
          {/* Left Section */}
          <div className="flex-1 text-left">
            <p className="text-lg font-bold text-[#502512] italic font-serif ">
              {user?.name || "N/A"}
            </p>
            <p className="text-sm">General Medicine</p>
            <p className="text-sm">
              Reg. No: {user?._id|| "N/A"}
            </p>
            <p className="text-xs h-2 "></p>

            {/* <div className="w-full h-[1px] bg-gradient-to-r from-black via-current to-transparent"></div> */}
            {/* <p className="text-md font-semibold">
              {" "}
              {user?.speciality?.length > 1
                ? `${user.speciality
                    .slice(0, user.speciality.length - 1)
                    .join(", ")} & ${
                    user.speciality[user.speciality.length - 1]
                  }`
                : user?.speciality[0] || "N/A"}
            </p> */}

            <p className="text-xs h-2 "></p>

            <div className="w-full h-[1px] bg-gradient-to-r from-black via-current to-transparent"></div>

            <p className="text-xs h-2 "></p>
          </div>

          {/* Middle Section (Image) */}
          <div className="flex items-center justify-center w-24">
            <img
              src={MiddleImage} 
              alt="Doctor"
              className="w-full h-auto rounded-full" // Adjust image size, shape as needed
            />
          </div>

          {/* Right Section */}
          {/* <div className="flex-1 text-right">
            <p className="text-lg font-bold text-[#502512] italic font-serif">
              {user?.hospitalname || "N/A"}
            </p>
            <p className="text-sm ">{user?.address || "Clinic Address N/A"}</p>
          </div> */}
        </div>

        <hr className="border-t-2 border-gray-600 mb-6 mt-3" />

        {/* Patient Details */}
        <div className="mb-4 mt-4">
          <h3 className="text-md font-bold text-gray-900 mb-2 font-poppins">
            <div className="text-sm italic mb-2">
              {"  "}
              {prescriptionId && (
                <span className="border border-black  px-2 py-1">
                  #{prescriptionId}
                </span>
              )}
            </div>
            Patient Details
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            <p className="break-words">
              <span className="font-semibold">Name:</span>{" "}
              {formData?.patientName || "N/A"}
            </p>
            <p className="break-words">
              <span className="font-semibold">Age:</span>{" "}
              {formData?.age || "N/A"}
            </p>
            <p className="break-words">
              <span className="font-semibold">Sex:</span>{" "}
              {formData?.sex || "N/A"}
            </p>
            <p className="break-words">
              <span className="font-semibold">Mobile:</span>{" "}
              {formData?.contact || "N/A"}
            </p>
            <p className="break-words">
              <span className="font-semibold">City:</span>{" "}
              {formData?.city || "N/A"}
            </p>
            <p className="break-words">
              <span className="font-semibold">Date & Time:</span>{" "}
              {new Date().toLocaleString("en-US", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* Vitals */}
        <div className="mb-6">
          <h3 className="text-md font-bold text-gray-900 mb-2 font-poppins">
            Additional Information:
          </h3>
          <div className="grid grid-cols-3 gap-4 text-xs">
            {[
              formData.weight && (
                <p className="break-words" key="weight">
                  <span className="font-semibold">Weight:</span>{" "}
                  {formData.weight} kg
                </p>
              ),
              formData.height && (
                <p className="break-words" key="height">
                  <span className="font-semibold">Height:</span>{" "}
                  {formData.height} cm
                </p>
              ),
              formData.bmi && (
                <p className="break-words" key="bmi">
                  <span className="font-semibold">BMI:</span> {formData.bmi}{" "}
                  (kg/m²)
                </p>
              ),
            ].filter(Boolean)}
          </div>
          <p className="">
            {formData.additionalinfo && (
              <p className="break-words text-xs mt-2" key="additionalinfo">
                <span className="font-semibold">Specify:</span>{" "}
                {formData.additionalinfo}{" "}
              </p>
            )}
          </p>
        </div>

        {/* Diagnosis */}
        <div className="mb-4 text-xs">
          <p className="mt-2">
            <span className="font-semibold text-sm ">Diagnosis:</span>{" "}
            {formData.diagnosis || "N/A"}
          </p>
          <p className="mt-2">
            <span className="font-semibold text-sm ">Investigation Test:</span>{" "}
            {formData.investigationtest || "N/A"}
          </p>
        </div>

        {/* Medicines Table */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-900 mb-2 flex items-center space-x-2">
            <FaPrescription className="h-8 w-5" />
            <span>Medicines</span>
          </h3>

          <div className="overflow-x-auto">
            {formData.medicines && formData.medicines.length > 0 ? (
              <table className="table-auto w-full text-sm text-left border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-sm">
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Sr.No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Drug Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Dosage
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Duration
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Advice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formData.medicines.map((medicine, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 text-xs"
                    >
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {medicine.name || "N/A"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {medicine.dosage ? (
                          <>
                            <label className="">
                              M:{" "}
                              <input
                                type="radio"
                                name={`morning-${index}`}
                                value="morning"
                                checked={medicine.dosage.morning === true}
                                className="focus:ring-0 "
                                readOnly
                              />{" "}
                            </label>

                            <label className="">
                              A:{" "}
                              <input
                                type="radio"
                                name={`afternoon-${index}`}
                                value="afternoon"
                                checked={medicine.dosage.afternoon === true}
                                className="focus:ring-0"
                                readOnly
                              />{" "}
                            </label>

                            <label className="">
                              E:{" "}
                              <input
                                type="radio"
                                name={`evening-${index}`}
                                value="evening"
                                checked={medicine.dosage.evening === true}
                                className="focus:ring-0"
                                readOnly
                              />{" "}
                            </label>

                            <label className="">
                              N:{" "}
                              <input
                                type="radio"
                                name={`night-${index}`}
                                value="night"
                                checked={medicine.dosage.night === true}
                                className="focus:ring-0"
                                readOnly
                              />{" "}
                            </label>

                            <br />
                            {medicine.dosage.beforeFood && "(Before Food)"}
                            {medicine.dosage.afterFood && "(After Food)"}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {medicine.duration && medicine.duration.durationDays ? (
                          <>
                            {medicine.duration.durationDays}{" "}
                            {medicine.duration.durationDays === 1
                              ? (
                                  medicine.duration.durationUnit || "day's"
                                ).replace(/'s$/, "")
                              : medicine.duration.durationUnit || "day's"}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {medicine.advice || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm">No medicines added.</p>
            )}

            <div className="bg-yellow-100  p-1 pb-2 border-l-2 border-yellow-500 text-gray-800 text-xs rounded-md mt-2">
              <p className="font-semibold">
                Note:
                <span className="font-medium">
                  {" "}
                  M = Morning , A = Afternoon , E = Evening , N = Night ,
                  Alternate Day = Day after Day , SOS = Emergency
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-900 ">Remarks</h3>
          <p className="text-xs">{formData.remarks || "N/A"}</p>
        </div>

        {/* Follow Up */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-900">
            Follow Up:{" "}
            <span className="text-xs font-normal">
              {formData.followup
                ? new Date(formData.followup)
                    .toLocaleDateString("en-GB") // Format as DD/MM/YYYY
                    .replace(/\//g, "-") // Replace slashes with dashes
                : "N/A"}
            </span>
          </h3>
        </div>

        {/* signature */}
        <div className="space-y-4 overflow-x-auto">
          <div className="flex justify-between gap-8">
            {/* Left Section: Contact Info */}
            <div className="flex flex-col space-y-2 w-1/2">
              <p className="text-xs font-semibold break-words">
                Mobile:{" "}
                <span className=" font-normal">{user?.mobileNumber}</span>
              </p>
              <p className="text-xs font-semibold break-words">
                Email: <span className="font-normal">{user?.email}</span>
              </p>
            </div>

            {/* Right Section: Signature */}
            <div className="flex flex-col items-center w-1/2">
              {/* <div className="w-full flex justify-center ">
                <img
                  src={user?.signature}
                  alt="Doctor's Signature"
                  className=" w-44 h-10 object-contain "
                />
              </div> */}
              <div className="text-center mt-2 text-xs">
                <p className="font-bold text-sm break-words">
                  {user?.name}
                </p>{" "}
                <p className="text-sm">General Medicine</p>

                <p className="break-words h-2"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PrescriptionPreview;
