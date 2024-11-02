import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phoneNumber: '',
    amountGiven: '',
    purpose: '',
    paymentMode: 'cash',
    amountSpent: [{ amount: '', purpose: '', billSnapshot: null }],
    amountReturned: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPhoneTerm, setSearchPhoneTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [nameExists, setNameExists] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm || searchPhoneTerm) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/expense/search`, {
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

  useEffect(() => {
    const checkExists = async () => {
      if (formData.name) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/expense/search`, {
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

  useEffect(() => {
    let timeout;
    if (message) {
      timeout = setTimeout(() => {
        setMessage('');
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [message]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAmountSpentChange = (index, field, value) => {
    const updatedAmountSpent = [...formData.amountSpent];
    updatedAmountSpent[index][field] = value;
    setFormData({ ...formData, amountSpent: updatedAmountSpent });
  };

  const addAmountSpentField = () => {
    setFormData({
      ...formData,
      amountSpent: [...formData.amountSpent, { amount: '', purpose: '', billSnapshot: null }],
    });
  };

// Remove the checkExists useEffect
// Remove nameExists condition in handleSubmit

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = isEditMode
      ? `${import.meta.env.VITE_BACKEND_URL}/api/expense/update/${formData.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/expense/create`;

    const response = await axios.post(url, formData);
    setMessage(isEditMode ? 'Expense entry updated successfully!' : 'Expense entry saved successfully!');
    setMessageType('success');
    resetForm();
  } catch (error) {
    console.error('Error submitting data:', error);
    setMessage('All details are mandatory');
    setMessage('Server error. Please try again.');
    setMessageType('error');
  }
};


  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/expense/delete/${formData.id}`);
      setMessage('Expense entry deleted successfully!');
      setMessageType('success');
      resetForm();
    } catch (error) {
      console.error('Error deleting entry:', error);
      setMessage('Failed to delete the entry. Please try again.');
      setMessageType('error');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      phoneNumber: '',
      amountGiven: '',
      purpose: '',
      paymentMode: 'cash',
      amountSpent: [{ amount: '', purpose: '', billSnapshot: null }],
      amountReturned: '',
    });
    setIsEditMode(false);
    setSearchTerm('');
    setSearchPhoneTerm('');
    setSearchResults([]);
    setNameExists(false);
  };

  const handleEdit = (entry) => {
    setFormData({
      id: entry._id,
      name: entry.name,
      phoneNumber: entry.phoneNumber || '',
      amountGiven: entry.amountGiven,
      purpose: entry.purpose,
      paymentMode: entry.paymentMode,
      amountSpent: entry.amountSpent || [],
      amountReturned: entry.amountReturned || '',
    });
    setIsEditMode(true);
    setSearchTerm('');
    setSearchPhoneTerm('');
    setSearchResults([]);
  };

  const handleNewEntry = () => {
    resetForm();
    setIsEditMode(false);
  };

  return (
    <div className="expenses-container">
      <h2>Expense Entry</h2>
      <div className="button-group">
        <button onClick={handleNewEntry}>New Entry</button>
          <button onClick={() => setIsEditMode(true)}>Edit Entry</button >
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

          {searchResults.length > 0 && (
            <div className="search-results">
              <h3>Search Results:</h3>
              <ul>
                {searchResults.map((entry) => (
                  <li key={entry._id} onClick={() => handleEdit(entry)}>
                    {entry.name} - {entry.amountGiven}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      <form onSubmit={handleSubmit} className="expense-entry-form">
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required />
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" />
        <input type="number" name="amountGiven" value={formData.amountGiven} onChange={handleInputChange} placeholder="Amount Given" required />
        <input type="text" name="purpose" value={formData.purpose} onChange={handleInputChange} placeholder="Purpose" />
        <select name="paymentMode" value={formData.paymentMode} onChange={handleInputChange}>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
          <option value="app">App</option>
        </select>

        {isEditMode && (
          <>
            {formData.amountSpent.map((spent, index) => (
              <div key={index} className="amount-spent-group">
                <input type="number" value={spent.amount} onChange={(e) => handleAmountSpentChange(index, 'amount', e.target.value)} placeholder={`Amount Spent ${index + 1}`} />
                <input type="text" value={spent.purpose} onChange={(e) => handleAmountSpentChange(index, 'purpose', e.target.value)} placeholder={`Purpose ${index + 1}`} />
                <input type="file" onChange={(e) => handleAmountSpentChange(index, 'billSnapshot', e.target.files[0])} />
              </div>
            ))}
            <button type="button" onClick={addAmountSpentField}>Add New</button>
            <input type="number" name="amountReturned" value={formData.amountReturned} onChange={handleInputChange} placeholder="Amount Returned" />
          </>
        )}

        <div className="form-buttons">
          {isEditMode && <button type="button" onClick={handleDelete}>Delete</button>}
          <button type="button" onClick={resetForm}>Cancel</button>
          <button type="submit">{isEditMode ? 'Update' : 'Submit'}</button>
        </div>
      </form>

      {message && <p className={`message ${messageType}`}>{message}</p>}
    </div>
  );
};

export default Expenses;
