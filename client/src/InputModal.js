import React, { useState } from 'react';
import './InputModal.css'

export default function InputModal({ isOpen, onClose, onSubmit }) {
    const [inputValue, setInputValue] = useState('');
  
    const handleSubmit = () => {
      if (inputValue.trim() === '') {
        alert('Please enter a valid document name.');
        return;
      }
  
      onSubmit(inputValue);
  
      // Clear the input and close the modal
      setInputValue('');
      onClose();
    };
  
    return (
       isOpen && <div className={`modal ${isOpen ? 'open' : ''}`}>
        <div className="modal-overlay" onClick={onClose}></div>
        <div className="modal-content">
          <h2>Enter a Name</h2>
          <input
            type="text"
            placeholder="Enter Name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
  