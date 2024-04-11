import axios from "axios";
import React, { useEffect, useState } from 'react';

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (selectedFile) {
                    axios.post('http://localhost:5000//test-up', selectedFile)
                        .then(response => {
                            //console.log(response.data);
                            //console.log(localStorage.getItem('username'));

                           // onCsvData(response.data); // Pass data to parent

                            // Display success message using a state variable
                            setSuccessMessage('Uploaded');

                            // Clear the message after a timeout (3 seconde)
                            const timeoutId = setTimeout(() => setSuccessMessage(''), 3000);
                            // Cleanup function to clear timeout on unmount
                            return () => clearTimeout(timeoutId);

                        })
                        .catch(error => {
                            console.error('Error uploading file:', error);
                        });
                }

            } catch (error) {
                console.error('Error uploading CSV file:', error);
            }
        };

        fetchData();
    }, [selectedFile]);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('username', localStorage.getItem('username'));
        setSelectedFile(formData);
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
                        {successMessage && (
                            <div className="p-1 px-2">
                                <button className="cursor-pointer rounded-lg bg-slate-400 py-2 px-4 font-semibold text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white"
                                >{successMessage}</button>

                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
