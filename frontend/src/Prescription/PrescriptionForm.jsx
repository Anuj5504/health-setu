import React, { useState } from "react";
import { FiUser, FiHeart, FiClipboard, FiEdit2 } from "react-icons/fi";
import { FaRegCalendarAlt } from "react-icons/fa";

const PrescriptionForm = ({ onChange, formData: initialFormData }) => {
  const [formData, setFormData] = useState(initialFormData || {
    patientName: "",
    age: "",
    sex: "",
    contact: "",
    city: "",
    bmi: "",
    weight: "",
    height: "",
    diagnosis: "",
    investigationtest: "",
    additionalinfo: "",
    medicines: [
      {
        name: "",
        dosage: {
          morning: false,
          afternoon: false,
          evening: false,
          night: false,
          beforeFood: false,
          afterFood: false,
        },
        duration: {
          durationDays: "",
          durationUnit: "day's",
        },
        advice: "",
      },
    ],
    remarks: "",
    followup: "",
    drugAllergies: [],
    otherDrugAllergies: "",
    healthIssues: [],
    otherHealthIssues: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData, [name]: value };
      onChange(newData);
      return newData;
    });
  };

  const handleMedicineChange = (index, e) => {
    const { name, value, checked } = e.target;
    const newMedicines = [...formData.medicines];

    if (
      [
        "morning",
        "afternoon",
        "evening",
        "night",
        "beforeFood",
        "afterFood",
      ].includes(name)
    ) {
      newMedicines[index].dosage[name] = checked;
    } else if (name === "durationDays") {
      const duration = parseInt(value);
      newMedicines[index].duration.durationDays =
        !isNaN(duration) && duration > 0 ? duration : "";
    } else if (name === "durationUnit") {
      newMedicines[index].duration.durationUnit = value;
    } else {
      newMedicines[index][name] = value;
    }

    setFormData((prevData) => {
      const newData = { ...prevData, medicines: newMedicines };
      onChange(newData);
      return newData;
    });
  };

  const addMedicine = () => {
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        medicines: [
          ...prevData.medicines,
          {
            name: "",
            dosage: {
              morning: false,
              afternoon: false,
              evening: false,
              night: false,
              beforeFood: false,
              afterFood: false,
            },
            duration: {
              durationDays: "",
              durationUnit: "day's",
            },
            advice: "",
          },
        ],
      };
      onChange(newData);
      return newData;
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData((prevData) => {
      const newData = { ...prevData, medicines: newMedicines };
      onChange(newData);
      return newData;
    });
  };

  const resetForm = () => {
    const resetData = {
      patientName: "",
      age: "",
      sex: "",
      contact: "",
      city: "",
      bmi: "",
      weight: "",
      height: "",
      additionalinfo: "",
      diagnosis: "",
      investigationtest: "",
      medicines: [
        {
          name: "",
          dosage: {
            morning: false,
            afternoon: false,
            evening: false,
            night: false,
            beforeFood: false,
            afterFood: false,
          },
          duration: {
            durationDays: "",
            durationUnit: "day's",
          },
          advice: "",
        },
      ],
      remarks: "",
      followup: "",
      drugAllergies: [],
      otherDrugAllergies: "",
      healthIssues: [],
      otherHealthIssues: "",
    };
    setFormData(resetData);
    onChange(resetData);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow space-y-6 max-w-4xl mx-auto">
      {/* Section: Patient Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FiUser className="mr-2 text-blue-500" /> Patient Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="patientName"
            placeholder="Patient's Name"
            value={formData.patientName}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Male"
                checked={formData.sex === "Male"}
                onChange={handleChange}
                className="mr-2 focus:ring-0"
              />
              Male
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Female"
                checked={formData.sex === "Female"}
                onChange={handleChange}
                className="mr-2"
              />
              Female
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sex"
                value="Other"
                checked={formData.sex === "Other"}
                onChange={handleChange}
                className="mr-2"
              />
              Other
            </label>
          </div>
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
        </div>
      </div>

      {/* Section: Vitals */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FiHeart className="mr-2 text-red-500" /> Additional Information:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="number"
            name="height"
            placeholder="Height (cm)"
            value={formData.height}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="number"
            name="bmi"
            placeholder="BMI (kg/m²)"
            value={formData.bmi}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
          <input
            type="text"
            name="additionalinfo"
            placeholder="Specify"
            value={formData.additionalinfo}
            onChange={handleChange}
            className="px-2 py-2 border border-gray-300 rounded w-full"
          />
        </div>
      </div>

      {/* Section: Diagnosis and Symptoms */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FiClipboard className="mr-2 text-green-500" /> Health Status
        </h2>
        <input
          type="text"
          name="diagnosis"
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          className="px-2 py-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          name="investigationtest"
          placeholder="Investigation Test"
          value={formData.investigationtest}
          onChange={handleChange}
          className="px-2 py-2 border border-gray-300 rounded w-full"
        />
      </div>

      {/* Section: Medicines */}
      <div className="space-y-4 ">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FiEdit2 className="mr-2 text-yellow-500" /> Medicines
        </h2>
         <div className="overflow-x-auto scrollbar-visible">
         <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-sm">Drug Name</th>
              <th className="border p-2 text-sm">Dosage</th>
              <th className="border p-2 text-sm">Duration</th>
              <th className="border p-2 text-sm">Advice</th>
              <th className="border p-2 text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.medicines.map((medicine, index) => (
              <tr key={index}>
                {/* Medicine Name */}
                <td className="border p-2">
                  <input
                    type="text"
                    name="name"
                    value={medicine.name}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Drug Name"
                    className="input-field text-sm p-1"
                  />
                </td>

                <td className="border p-2">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <label>M</label>
                      <input
                        type="checkbox"
                        name="morning"
                        checked={medicine.dosage.morning}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field focus:ring-0"
                      />
                      <label>A</label>
                      <input
                        type="checkbox"
                        name="afternoon"
                        checked={medicine.dosage.afternoon}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field focus:ring-0"
                      />
                      <label>E</label>
                      <input
                        type="checkbox"
                        name="evening"
                        checked={medicine.dosage.evening}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field focus:ring-0"
                      />
                      <label>N</label>
                      <input
                        type="checkbox"
                        name="night"
                        checked={medicine.dosage.night}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field focus:ring-0"
                      />
                    </div>

                    {/* Before or After Food */}
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex flex-col items-center">
                        <label>Before Food</label>
                        <input
                          type="checkbox"
                          name="beforeFood"
                          checked={medicine.dosage.beforeFood}
                          onChange={(e) => handleMedicineChange(index, e)}
                          className="input-field focus:ring-0"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <label>After Food</label>
                        <input
                          type="checkbox"
                          name="afterFood"
                          checked={medicine.dosage.afterFood}
                          onChange={(e) => handleMedicineChange(index, e)}
                          className="input-field focus:ring-0"
                        />
                      </div>
                    </div>
                  </div>
                </td>

                {/* Duration (Days + Total Tabs) */}
                <td className="border p-2">
                  <div className="space-y-2">
                    {/* Duration Input */}
                    <div className="flex items-center space-x-2 text-xs">
                      <label>Duration</label>
                      <input
                        type="number"
                        name="durationDays"
                        value={medicine.duration.durationDays}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field text-xs p-1 w-20"
                      />
                      <select
                        name="durationUnit"
                        value={medicine.duration.durationUnit}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="input-field text-xs p-1"
                      >
                        <option value="day's">Day's</option>
                        <option value="alternate day's">Alternate Day's</option>
                        <option value="week's">Week's</option>
                        <option value="month's">Month's</option>
                        <option value="sos">SOS</option>
                      </select>
                    </div>
                  </div>
                </td>

                {/* Advice */}
                <td className="border p-2">
                  <input
                    type="text"
                    name="advice"
                    value={medicine.advice}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="Advice"
                    className="input-field  p-1 text-xs"
                  />
                </td>

                {/* Remove Button */}
                <td className="border p-2">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className="flex justify-start mt-2">
          <button
            type="button"
            onClick={addMedicine}
            className="text-blue-500 text-sm hover:text-blue-700"
          >
            Add Drug
          </button>
        </div>

        <div className="bg-yellow-100 p-4 border-l-4 border-yellow-500 text-gray-800 text-sm rounded-md shadow-md">
          <p className="font-semibold">Note:</p>
          <p>
            M = Morning , A = Afternoon , E = Evening , N = Night , Alternate
            Day = Day after Day , SOS = Emergency
          </p>
        </div>
      </div>

      {/* Section: Remarks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FiClipboard className="mr-2 text-teal-500" /> Remarks
        </h2>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          placeholder="Remarks"
          className="px-2 py-2 border border-gray-300 rounded w-full resize-none"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center mb-4">
          <FaRegCalendarAlt className="mr-2 text-purple-500" />
          Follow Up
        </h2>
        <input
          type="date"
          name="followup"
          value={formData.followup}
          onChange={handleChange}
          min={
            new Date(
              new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            )
              .toISOString()
              .split("T")[0]
          }
          placeholder="Remarks"
          className="px-2 py-2 border border-gray-300 rounded resize-none"
        />
      </div>

      {/* Reset Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={resetForm}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PrescriptionForm;
