import { createContext, useContext, useState } from "react";

const StepperContext = createContext({ userData: "", setUserData: null, file: null, setFile: null });

export function UseContextProvider({ children }) {
  const [userData, setUserData] = useState("");
  const [file, setFile] = useState(null);
  
  return (
    <StepperContext.Provider value={{ userData, setUserData, file, setFile }}>
      {children}
    </StepperContext.Provider>
  );
}

export function useStepperContext() {
  const { userData, setUserData, file, setFile } = useContext(StepperContext);

  return { userData, setUserData, file, setFile };
}
