import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncomeEntry = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    amount: '',
    category: 'villagers',
    status: 'Not paid',
    paymentMode: 'cash',
  });
  const [showPaymentMode, setShowPaymentMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhoneTerm, setSearchPhoneTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [nameExists, setNameExists] = useState(false);

  // Fetch search data based on name or phone number
  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm || searchPhoneTerm) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/income/search`, {
            params: { name: searchTerm, phoneNumber: searchPhoneTerm },
          });
          setSearchResults(response.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      } else {
        setSearchResults([]);
      }
    };
    fetchData();
  }, [searchTerm, searchPhoneTerm]);

  // Check if name already exists
  useEffect(() => {
    const checkExists = async () => {
      if (formData.name) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/income/search`, {
            params: { name: formData.name },
          });
          setNameExists(response.data.length > 0 && !isEditMode);
        } catch (error) {
          console.error('Error checking existence:', error);
        }
      } else {
        setNameExists(false);
      }
    };
    checkExists();
  }, [formData.name, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'status') {
      setShowPaymentMode(value === 'Paid');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameExists && !isEditMode) {
      setMessage('Name already exists.');
      setMessageType('error');
      return;
    }

    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_BACKEND_URL}/api/income/update/${formData.id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/income/create`;
      const response = await axios.post(url, formData);
      setMessage(isEditMode ? 'Income entry updated successfully!' : 'Income entry saved successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Server error. Please try again.');
      setMessageType('error');
    } finally {
      setTimeout(() => setMessage(''), 3000);
      resetForm();
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phoneNumber: '',
      amount: '',
      category: 'villagers',
      status: 'Not paid',
      paymentMode: 'cash',
    });
    setShowPaymentMode(false);
    setSearchTerm('');
    setSearchPhoneTerm('');
    setSearchResults([]);
    setIsEditMode(false);
    setNameExists(false);
  };

  const handleEdit = (entry) => {
    setFormData({
      id: entry._id,
      name: entry.name,
      email: entry.email || '',
      phoneNumber: entry.phoneNumber || '',
      amount: entry.amount,
      category: entry.category,
      status: entry.status,
      paymentMode: entry.paymentMode,
    });
    setIsEditMode(true);
    setShowPaymentMode(entry.status === 'Paid');
    setSearchTerm('');
    setSearchPhoneTerm('');
    setSearchResults([]);
  };

  const handleNewEntry = () => {
    resetForm();
    setIsEditMode(false);
  };

  return (
    <div className="income-entry-container form-container">
      <h2>Income Entry</h2>
      <div className="button-group">
        <button onClick={handleNewEntry} className="new-entry-button">
          New Entry
        </button>
        <button
          onClick={() => setIsEditMode(true)}
          className={`edit-entry-button ${isEditMode ? 'active' : ''}`}
        >
          Edit Entry
        </button>
      </div>

      {isEditMode && (
        <>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Phone Number"
              value={searchPhoneTerm}
              onChange={(e) => setSearchPhoneTerm(e.target.value)}
            />
          </div>

          {/* Displaying search results below the inputs */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results:</h3>
              <ul>
                {searchResults.map(entry => (
                  <li key={entry._id} onClick={() => handleEdit(entry)}>
                    {entry.name} - {entry.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} className="income-entry-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        {nameExists && <p className="error-message">Name already exists.</p>}
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone Number"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="Amount"
          required
        />
        <select name="category" value={formData.category} onChange={handleInputChange}>
          <option value="villagers">Villagers</option>
          <option value="youth">Youth</option>
        </select>
        <select name="status" value={formData.status} onChange={handleInputChange}>
          <option value="Not paid">Not paid</option>
          <option value="Paid">Paid</option>
        </select>
        {showPaymentMode && (
          <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange}>
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="app">App</option>
          </select>
        )}
        <div className="form-buttons">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">{isEditMode ? 'Update Entry' : 'Submit'}</button>
        </div>
      </form>

      {message && (
        <p className={`message ${messageType}`}>{message}</p>
      )}
    </div>
  );
};

export default IncomeEntry;
