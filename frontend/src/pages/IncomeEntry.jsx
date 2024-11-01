import React, { useState } from 'react';
import axios from 'axios';

const IncomeEntry = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    amount: '',
    category: 'villagers',
    status: 'Not paid', // default
    paymentMode: 'cash', // default
  });

  // State to show/hide payment mode and message
  const [showPaymentMode, setShowPaymentMode] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'status') {
      // Show Payment Mode only if 'paid' is selected
      setShowPaymentMode(value === 'paid');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/income/create`, formData);
      console.log('Form submitted successfully:', response.data);

      // Show success message
      setMessage('Income entry added successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds

      // Reset the form after submission
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        amount: '',
        category: 'villagers',
        status: 'Not paid',
        paymentMode: 'cash',
      });
      setShowPaymentMode(false); // Hide payment mode field after reset
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Error adding income entry.'); // Show error message
      setMessageType('error');
      setTimeout(() => setMessage(''), 2000); // Clear message after 2 seconds
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      amount: '',
      category: 'villagers',
      status: 'Not paid',
      paymentMode: 'cash',
    });
    setShowPaymentMode(false);
    setMessage(''); // Clear message
  };

  return (
    <div className="income-entry-container">
      <form className="income-entry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />

        <input
          type="tel"
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

        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="villagers">Villagers</option>
          <option value="youth">Youth</option>
        </select>

        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value="paid">Paid</option>
          <option value="Not paid">Not Paid</option>
        </select>

        {showPaymentMode && (
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleInputChange}
            required
          >
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="app">App</option>
          </select>
        )}

        <div className="form-buttons">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">Submit</button>
        </div>

        {message && (
          <div className={`form-message ${messageType}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default IncomeEntry;
