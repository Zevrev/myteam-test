import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [inputData, setInputData] = useState("");
  const [outputData, setOutputData] = useState(null);
  const [loading, setLoading] = useState(false);

  const processData = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/process", {
        data: inputData,
      });

      if (!response.data) {
        toast.error(
          "Invalid data format. Your data must be a stringified JSON."
        );
      }

      let outputData = JSON.stringify(response.data);
      setOutputData(JSON.parse(outputData));
    } catch (error) {
      console.error("Error processing data:", error);
    } finally {
      setLoading(false);
      setInputData("");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="overflow-x-hidden">
        <div className="d-flex align-items-center justify-content-center">
          <p className="fs-1 fw-semibold">Timber Docking Processor</p>
        </div>

        <div className="mx-5 mb-3">
          <textarea
            className="form-control h-100 "
            placeholder="Enter the transformations here..."
            id="floatingTextarea"
            rows={10}
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
        </div>

        <div className="d-flex align-items-center justify-content-center">
          <button
            onClick={processData}
            type="button"
            className="btn btn-primary"
            disabled={!inputData || loading}
            style={{ width: "90px" }}
          >
            {loading ? (
              <div
                className="spinner-border text-light spinner-border-sm"
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <span>Process</span>
            )}
          </button>
        </div>

        {outputData && (
          <div className="mt-3">
            <div className="d-flex align-items-center justify-content-center">
              <p className="fs-1 fw-semibold">Processed Data</p>
            </div>
            <div>
              {outputData.map((transaction, index) => (
                <div className="card mb-3 mx-5" key={index}>
                  <div className="card-body">
                    <p className="fw-bold">
                      Transaction ID: {transaction.transaction}
                    </p>
                    <p>Balance: {transaction.balance}</p>
                    <p>Is Valid: {transaction.isValid ? "Yes" : "No"}</p>
                    <p className="mb-0">Error Reason: {transaction.errorReason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
