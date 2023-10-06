import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export default function Calender(props) {
  const { value, onChange, onCancel, onSave } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="border-2 border-gray-300 rounded-lg shadow-2xl flex flex-col items-center w-fit  bg-slate-100 absolute bottom-0 left-0.5 z-50">
        <DateCalendar
          value={value}
          onChange={onChange}
          className="bg-slate-100 rounded-lg"
        />
        <div className="mb-2">
          <button
            className="mx-2 w-28 px-2 py-1 border shadow-md rounded-md bg-gray-100 active:bg-gray-200"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="mx-2 w-28 px-2 py-1 border shadow-md rounded-md text-white bg-blue-800 hover:bg-blue-700 active:bg-blue-600"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
