import axios from 'axios';
import DownloadIcon from '@mui/icons-material/Download';

export default function StepperControl({ handleClick, currentStep, steps }) {

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/download/csv', {
        responseType: 'blob',
      });

      // Create a blob URL for the CSV data
      const csvUrl = window.URL.createObjectURL(new Blob([response.data]));

      // Create an anchor element to trigger download
      const link = document.createElement('a');
      link.href = csvUrl;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div className=" mt-4 mb-8 flex justify-around">

      <button
        onClick={() => handleClick()}
        className={`cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2 px-4 font-semibold uppercase text-slate-400 transition duration-200 ease-in-out hover:bg-black hover:text-black
         ${currentStep === 1 ? " cursor-not-allowed opacity-50 " : ""
          }`}
      >
        Back
      </button>


      {currentStep === 3 && (
        <button onClick={handleDownloadCSV} className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded">
          <DownloadIcon /> CSV
        </button>
      )}

      <button
        onClick={() => handleClick(currentStep === steps.length ? "reset" : "next")}
        className={`cursor-pointer rounded-lg bg-green-500 py-2 px-4 font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-slate-700 hover:text-white
        ${currentStep === steps.length ? "bg-red-500 text-white" : ""
          }`}
      >
        {currentStep === steps.length - 1 ? "Confirm" : (currentStep === steps.length ? "Reset" : "Next")}
      </button>


    </div>
  );
}
