import React, { useRef } from 'react';
import { Upload, X, File } from 'lucide-react';

export const FileUpload = ({ label, name, onFileChange, accept = '.pdf,.jpg,.jpeg,.png', required = false }) => {
  const inputRef = useRef(null);
  const [file, setFile] = React.useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onFileChange({ target: { name, files: [selectedFile] } });
    }
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileChange({ target: { name, files: [] } });
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div
        className="border-2 border-dashed border-slate-600/50 rounded-lg p-6 hover:border-emerald-500/50 transition-colors cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          required={required}
        />

        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 hover:bg-slate-700/50 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-300 text-sm font-medium">Drop file here or click to upload</p>
            <p className="text-xs text-slate-500 mt-1">PDF or Image (max 5MB)</p>
          </div>
        )}
      </div>
    </div>
  );
};
