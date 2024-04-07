import { useStepperContext } from "../../contexts/StepperContext";
import axios from "axios";
import React, { useState } from 'react';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);

    axios.post('http://localhost:5000/v2/upload', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  return (
    <div className="flex flex-col ">
      <div className="mx-2 w-full flex-1">
        <div className="mx-2 w-full flex-1">
          <div className="mt-3 h-6 text-xs font-bold uppercase leading-8 text-gray-500">
            Upload File
          </div>
          <div className="my-2 flex rounded border border-gray-200 bg-white p-1">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-1 px-2 text-gray-800 outline-none"
            />
            <button className="cursor-pointer rounded-lg bg-slate-400 py-2 px-4 font-semibold text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white"
            onClick={handleUpload}>Upload</button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
