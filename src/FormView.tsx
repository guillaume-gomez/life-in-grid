import React from 'react';
import FormSteps from "./Forms/FormSteps";
import DataForm from "./reducers/useCreateLifeInGridReducer";


function FormView() {
  return (
    <div className="flex justify-center">
      <div className="card md:w-9/12 bg-base-300 shadow-xl">
        <div className="card-body gap-7 justify-center">
          <h2 className="card-title">Create your life grid</h2>
          <DataForm.Provider>
            <FormSteps />
          </DataForm.Provider>
        </div>
      </div>
    </div>
  );
}

export default FormView;
