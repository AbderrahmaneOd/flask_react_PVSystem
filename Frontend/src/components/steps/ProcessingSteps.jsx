import { useState } from "react";
import Stepper from "./Stepper";
import StepperControl from "./StepperControl";
import { UseContextProvider } from "../../contexts/StepperContext";
import axios from 'axios';
import Upload from "./Upload";
import Preprocessing from "./Preprocessing";
import Predict from "./Predict";
import Visualisation from "./Visualisation";

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "Upload",
    "Preprocessing",
    "Predict",
    "Visualisation",
  ];

  const displayStep = (step) => {
    switch (step) {
      case 1:
        return <Upload />;
      case 2:
        return <Preprocessing  />;
      case 3:
        return <Predict />;
      case 4:
        return <Visualisation />;
      default:
    }
  };

  const handleClick = async (direction) => {
    let newStep = currentStep;

    direction === "next" ? newStep++ : newStep--;
    // check if steps are within bounds
    newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);

    if (direction === "reset") {

      try {
        const response = await axios.get('http://localhost:5000/delete');
        const data = response.data;
        console.log(data);
        
      } catch (error) {
        console.error("Error resetting:", error);
        // Handle reset error (optional)
      }
      // Reset to first step
      setCurrentStep(1);
      newStep = 1;
    }
  };

  return (
    <div className="mx-auto rounded-2xl bg-white pb-2 md:w-90">
      {/* Stepper */}
      <div className="horizontal mt-5 ">
        <Stepper steps={steps} currentStep={currentStep} />

        <div className="my-10 p-10 ">
          <UseContextProvider>{displayStep(currentStep)}</UseContextProvider>
        </div>


        {/* navigation button */}
        {currentStep !== steps.length + 1 && (
          <StepperControl
            handleClick={handleClick}
            currentStep={currentStep}
            steps={steps}
          />
        )}
      </div>
    </div>
  );
}

export default App;
