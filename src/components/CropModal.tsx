import React from "react";

export interface CropModalProps {
  image: string;
  onClose: () => void;
  onCrop: (croppedImage: string) => void;
}

const CropModal: React.FC<CropModalProps> = ({ image, onClose, onCrop }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <img src={image} alt="To crop" className="max-w-xs" />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => onCrop(image)}
          >
            Crop
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;