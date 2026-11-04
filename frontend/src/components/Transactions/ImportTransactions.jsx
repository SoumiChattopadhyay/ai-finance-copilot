
import { useRef, useState } from "react";
import "./ImportTransactions.css";

function ImportTransactions({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const fileInputRef = useRef(null);

  const selectFile = (selectedFile) => {
    setMessage("");
    setUploadResult(null);

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setMessage("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    selectFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setUploadResult(null);

      const result = await onUpload(file);

      setUploadResult(result);
      setMessage(result.message || "CSV processing completed.");

      setFile(null);
      fileInputRef.current.value = "";
    } catch (error) {
      setMessage(error.message || "CSV upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="import-container">
      <div className="import-heading">
        <h2>Import Transactions</h2>
        <p>Upload your transaction history in seconds.</p>
      </div>

      <form onSubmit={handleUpload}>
        <div
          className={`upload-dropzone ${dragging ? "dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current.click();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="upload-icon">↑</div>
          <h3>Drag and drop your CSV file here</h3>
          <p>or <span>browse files</span> from your device</p>
          <small>CSV files only (Maximum 5 MB)</small>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={(e) => selectFile(e.target.files[0])}
          />
        </div>

        {file && (
          <div className="selected-file">
            <span>📄 {file.name}</span>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                fileInputRef.current.value = "";
                setMessage("");
                setUploadResult(null);
              }}
            >
              Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary upload-button"
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>

        {message && (
          <p className="upload-message" role="status">
            {message}
          </p>
        )}

        {uploadResult && (
          <div className="upload-message">
            <p>Imported: {uploadResult.importedCount}</p>
            <p>Invalid rows: {uploadResult.invalidCount}</p>

            {uploadResult.invalidRows?.length > 0 && (
              <div>
                <strong>Rows with errors:</strong>
                {uploadResult.invalidRows.map((item) => (
                  <p key={item.row}>
                    Row {item.row}: {item.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default ImportTransactions;
