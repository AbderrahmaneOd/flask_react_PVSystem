import { useState, useEffect } from "react";
import axios from 'axios';

export default function DataSplitting() {
  const [data, setData] = useState([]);
  const [splittingStrategy, setSplittingStrategy] = useState("");
  const [trainPercentage, setTrainPercentage] = useState(80);
  const [testPercentage, setTestPercentage] = useState(20);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    //fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const splitByYears = (trainingYears, validationYears) => {
  };

  const splitByDays = (trainingDays, validationDays) => {
  };

  const randomSplit = () => {
  };

  // Function to handle splitting based on selected strategy
  const handleSplitting = () => {

    if (trainPercentage <= 0 || trainPercentage >= 100) {
      setError('Train percentage should be between 0 and 100');
      return;
    }

    if (testPercentage <= 0 || testPercentage >= 100) {
      setError('Train percentage should be between 0 and 100');
      return;
    }

    if (trainPercentage + testPercentage > 100) {
      setError('Train percentage should be between 0 and 100');
    } else {
      setSuccessMessage("Data is splitted");
    }



    const timeoutId = setTimeout(() => setError(''), 2000);
    const timeoutId2 = setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Data Splitting</h2>
        <select
          value={splittingStrategy}
          onChange={(e) => setSplittingStrategy(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="">Select splitting strategy</option>
          <option value="years">Split by years</option>
          <option value="days">Split by days</option>
          <option value="random">Random split</option>
        </select>

        <div className="mt-4">
          <label className="mr-2">Train Percentage:</label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
            type="number"
            value={trainPercentage}
            onChange={(e) => setTrainPercentage(parseInt(e.target.value))}
            min="1"
            max="99"
          /> %
        </div>

        <div className="mt-4">
          <label className="mr-2">Test Percentage:</label>
          <input
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
            type="number"
            value={testPercentage}
            onChange={(e) => setTestPercentage(parseInt(e.target.value))}
            min="1"
            max="99"
          /> %
        </div>

        <div className="mt-4">
          <button onClick={handleSplitting} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded">Split Data</button>
        </div>

        {successMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

      </div>
    </div>
  );
}
