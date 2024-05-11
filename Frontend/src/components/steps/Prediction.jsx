import React, { useState } from 'react';
import ModelEvaluationTable from '../scripts/ModelEvaluationTable';
import TrainingComponent from '../scripts/ModelTraining';

export default function Prediction() {
  const [mode, setMode] = useState('test');

  return (
    <div className="flex flex-col">
      <div class="flex items-center justify-center mb-4">
        <label class="mr-4 cursor-pointer">
          <input
            type="radio"
            value="test"
            checked={mode === 'test'}
            onChange={() => setMode('test')}
            class="hidden"
          />
          <span class="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded {{ mode === 'test' ? 'bg-blue-500 text-white' : '' }}">
            Evaluation
          </span>
        </label>
        <label class="cursor-pointer">
          <input
            type="radio"
            value="training"
            checked={mode === 'training'}
            onChange={() => setMode('training')}
            class="hidden"
          />
          <span class="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded {{ mode === 'training' ? 'bg-blue-500 text-white' : '' }}">
            Training
          </span>
        </label>
      </div>


      {mode === 'test' ? (
        <ModelEvaluationTable />
      ) : (
        <TrainingComponent />
      )}
    </div>
  );
}
