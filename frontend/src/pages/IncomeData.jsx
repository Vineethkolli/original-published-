import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IncomeData = () => {
    const [incomeEntries, setIncomeEntries] = useState([]); // Initial state is an array
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        status: '',
    });

    const [columnVisibility, setColumnVisibility] = useState({
        email: false,
        phoneNumber: false,
        amount: true,
        category: false,
        status: false,
        paymentMode: false,
    });

    // Fetch income entries from the database
    const fetchIncomeEntries = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/income`); // Use backticks for template literals
            
            // Ensure the response data is an array
            if (Array.isArray(response.data)) {
                setIncomeEntries(response.data);
            } else {
                console.error('Expected an array but received:', response.data);
                setIncomeEntries([]); // Reset to an empty array if the data is not valid
            }
        } catch (error) {
            console.error('Error fetching income entries:', error);
            setIncomeEntries([]); // Reset to an empty array on error
        }
    };

    useEffect(() => {
        fetchIncomeEntries();
    }, []);

    // Filter the income entries based on user input
    const filteredEntries = incomeEntries.filter(entry => {
        return (
            (filters.name ? entry.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
            (filters.category ? entry.category.toLowerCase() === filters.category.toLowerCase() : true) &&
            (filters.status ? entry.status.toLowerCase() === filters.status.toLowerCase() : true)
        );
    });

    // Handle checkbox changes
    const handleColumnToggle = (column) => {
        setColumnVisibility((prev) => ({
            ...prev,
            [column]: !prev[column],
        }));
    };

    // Print function
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <h1>Income Data</h1>
            <button onClick={handlePrint} style={{ marginBottom: '10px' }}>
                🖨️ Print
            </button>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by name"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by category"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                />
            </div>

            {/* Checkboxes for column visibility */}
            <div className="column-visibility">
                <label>
                    <input
                        type="checkbox"
                        checked={columnVisibility.email}
                        onChange={() => handleColumnToggle('email')}
                    />
                    Email
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={columnVisibility.phoneNumber}
                        onChange={() => handleColumnToggle('phoneNumber')}
                    />
                    Phone Number
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={columnVisibility.category}
                        onChange={() => handleColumnToggle('category')}
                    />
                    Category
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={columnVisibility.status}
                        onChange={() => handleColumnToggle('status')}
                    />
                    Status
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={columnVisibility.paymentMode}
                        onChange={() => handleColumnToggle('paymentMode')}
                    />
                    Payment Mode
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        {columnVisibility.email && <th>Email</th>}
                        {columnVisibility.phoneNumber && <th>Phone Number</th>}
                        <th>Amount</th>
                        {columnVisibility.category && <th>Category</th>}
                        {columnVisibility.status && <th>Status</th>}
                        {columnVisibility.paymentMode && <th>Payment Mode</th>}
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEntries.length > 0 ? (
                        filteredEntries.map(entry => (
                            <tr key={entry._id}>
                                <td>{entry.name}</td>
                                {columnVisibility.email && <td>{entry.email}</td>}
                                {columnVisibility.phoneNumber && <td>{entry.phoneNumber}</td>}
                                <td>{entry.amount}</td>
                                {columnVisibility.category && <td>{entry.category}</td>}
                                {columnVisibility.status && <td>{entry.status}</td>}
                                {columnVisibility.paymentMode && <td>{entry.paymentMode}</td>}
                                <td>{new Date(entry.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No entries found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default IncomeData;
