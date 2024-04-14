import React, { useState } from 'react';

function Dropzone({ onFilesChange }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };


  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result);
      setFile(file); // Сохраняем загруженный файл в состоянии
      onFilesChange(file); // Вызываем колбэк для передачи файла в компонент-родитель
    };
  };

  return (
    <div className="w-[200px] relative border-2 border-gray-300 border-dashed rounded-lg p-6" 
         onDragOver={handleDragOver} 
         onDragLeave={handleDragLeave} 
         onDrop={handleDrop}>
      <input type="file" className="absolute inset-0 w-full h-full opacity-0 z-50" onChange={handleChange} />
      <div className="text-center">
        <img className="mx-auto h-12 w-12" src="https://www.svgrepo.com/show/357902/image-upload.svg" alt="" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          <label htmlFor="file-upload" className="relative cursor-pointer">
            <span>Расмни танланг</span>
            <span className="text-indigo-600">&nbsp; йоки колдиринг</span>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
          </label>
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, 10MB гача
        </p>
      </div>
      {preview && <img src={preview} className="mt-4 mx-auto max-h-40" alt="preview" />}
    </div>
  );
}

export default Dropzone;
