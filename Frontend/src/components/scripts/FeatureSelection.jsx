import React, { useState, useEffect } from 'react';

const ColumnSelector = () => {
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    useEffect(() => {
        fetchColumns();
    }, []);

    const fetchColumns = async () => {
        try {
            const response = await fetch('http://localhost:5000/columns');
            const data = await response.json();
            setColumns(data.columns);
        } catch (error) {
            console.error('Error fetching columns:', error);
        }
    };

    const handleCheckboxChange = (columnName) => {
        if (selectedColumns.includes(columnName)) {
            setSelectedColumns(selectedColumns.filter(col => col !== columnName));
        } else {
            setSelectedColumns([...selectedColumns, columnName]);
        }
    };

    const handleDeleteSelectedColumns = async () => {
        try {
            const response = await fetch('http://localhost:5000/delete/columns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ columns: selectedColumns })
            });
            if (response.ok) {
                // Columns deleted successfully
                setColumns(columns.filter(col => !selectedColumns.includes(col)));
                setSelectedColumns([]);
                
                setSuccessMessage('Columns deleted successfully');

                // Clear the message after a timeout (3 seconde)
                const timeoutId = setTimeout(() => setSuccessMessage(''), 2400);
                // Cleanup function to clear timeout on unmount
                return () => clearTimeout(timeoutId);

            } else {
                // Handle error response
                console.error('Failed to delete columns:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting columns:', error);
        } finally {
            // Clear selected columns
            setSelectedColumns([]);
        }
    };

    return (
        <div className="p-4 border-1 border-dashed border-emerald-600 rounded-2xl">
            <h2 className="text-lg font-bold mb-4">Column Selector</h2>
            <div className="grid grid-cols-2 gap-4">
                {columns.map((columnName, index) => (
                    <div key={index} className="flex items-center">
                        <input
                            type="checkbox"
                            id={columnName}
                            className="mr-2"
                            checked={selectedColumns.includes(columnName)}
                            onChange={() => handleCheckboxChange(columnName)}
                        />
                        <label htmlFor={columnName}>{columnName}</label>
                    </div>
                ))}
            </div>
            <button
                className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white mt-4 py-2 px-4 border-1 border-blue-500 hover:border-transparent rounded"
                onClick={handleDeleteSelectedColumns}
            >
                Delete Columns
            </button>
            {successMessage && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;
