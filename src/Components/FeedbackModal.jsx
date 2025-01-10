import React from 'react';
import { X } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, onSubmit, feedbackText, setFeedbackText, feedbackType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {feedbackType === 'up' ? 'Positive' : 'Negative'} Feedback
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          placeholder="Please provide additional feedback (optional)"
          className="w-full p-3 border rounded-lg mb-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button onClick={onSubmit} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
