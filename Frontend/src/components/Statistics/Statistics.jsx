import React, { useState, useEffect } from 'react';
import { Button, Card, Modal, Table } from 'react-bootstrap';
import axios from 'axios';
import Papa from 'papaparse';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Statistics() {
    const [csvData, setCsvData] = useState([]);
    const [rowsToShow, setRowsToShow] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [numRows, setNumRows] = useState(0);
    const [numCols, setNumCols] = useState(0);
    const [numNulls, setNumNulls] = useState(0);

    const [formData, setFormData] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [boxplotImage, setBoxplotImage] = useState(null); // Ajouter un état pour stocker l'image du diagramme en boîte à moustaches
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleCheckboxChange = (e) => {
        const columnName = e.target.value;
    
        if (selectedColumns.includes(columnName)) {
            setSelectedColumns(prevState => prevState.filter(col => col !== columnName));
        } else {
            setSelectedColumns(prevState => [...prevState, columnName]);
        }
    
        if (selectedColumns.length === 1 && selectedColumns.includes(columnName)) {
            setStatistics(null);
        }
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (formData) {
                    const response = await axios.post('http://localhost:5000/upload-csv', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    if (response.status === 200) {
                        const data = response.data;

                        setNumRows(data.numRows);
                        setNumCols(data.numCols);
                        setNumNulls(data.nombre_de_nuls_total);

                        setFileUploaded(true);
                    } else {
                        console.error('Failed to upload CSV file.');
                    }
                }
            } catch (error) {
                console.error('Error uploading CSV file:', error);
            }
        };

        fetchData();
    }, [formData]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.type !== 'text/csv') {
            alert('Veuillez sélectionner un fichier de type CSV.');
            e.target.value = '';
            return;
        }

        const newFormData = new FormData();
        newFormData.append('file', file);
        setFormData(newFormData);
        parseCSVFile(file);
    };

    const parseCSVFile = (file) => {
        Papa.parse(file, {
            complete: (result) => {
                const data = result.data;
                const headers = data[0];
                const csvData = data.slice(1).map(row => {
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = row[index];
                    });
                    return rowData;
                });
                setCsvData(csvData);
                setSelectedColumns([]);
            },
            error: (error) => {
                console.error('Error parsing CSV file:', error);
                setShowModal(true);
            }
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const loadMoreRows = () => {
        setRowsToShow(rowsToShow + 5);
    };

    const loadLessRows = () => {
        const newRowsToShow = rowsToShow - 5;
        setRowsToShow(newRowsToShow >= 5 ? newRowsToShow : 5);
    };

    const showStatistiques = async () => {
        if (selectedColumns.length === 0) {
            alert("Veuillez sélectionner au moins une colonne.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/show-statistiques', { selectedColumns });
            setStatistics(response.data.statistics);
            setBoxplotImage(`data:image/png;base64, ${response.data.boxplot_image}`); // Récupérer et définir l'image base64
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    return (
        <div className="container mt-4">
            <input className="form-control mb-3" type="file" accept=".csv, .xlsx" onChange={handleFileChange} />

            {fileUploaded && (
                <div className="d-flex justify-content-center">
                    <Card className="m-2" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Number of Rows</Card.Title>
                            <Card.Text>
                                <h2>{numRows}</h2>
                            </Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="m-2" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Number of Columns</Card.Title>
                            <Card.Text>
                                <h2>{numCols}</h2>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Card className="m-2" style={{ width: '18rem' }}>
                        <Card.Body>
                            <Card.Title>Number of null fields</Card.Title>
                            <Card.Text>
                                <h2>{numNulls}</h2>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )}

            {csvData.length > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            {Object.keys(csvData[0]).map((header, index) => (
                                <th key={index}>
                                    <input
                                        type="checkbox"
                                        value={header}
                                        checked={selectedColumns.includes(header)}
                                        onChange={handleCheckboxChange}
                                    />
                                    {header}
                                </th>
                            ))}

                        </tr>
                    </thead>
                    <tbody>
                        {csvData.slice(0, rowsToShow).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, columnIndex) => (
                                    <td key={columnIndex}>{value}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {csvData.length > rowsToShow && (
                <div className="d-flex justify-content-center">
                    <Button variant="primary" onClick={loadMoreRows} className="mr-2">
                        Load More
                    </Button>
                    <Button variant="primary" onClick={loadLessRows}>
                        Load Less
                    </Button>
                    <Button variant="primary" onClick={showStatistiques}>
                        Show Statistiques
                    </Button>

                </div>
            )}

            <div>
                {statistics && (
                    <div>
                        <h1>Statistics</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Column Name</th>
                                    <th>Statistic</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(statistics).map(([columnName, stats]) => (
                                    Object.entries(stats).map(([statisticName, value], index) => (
                                        <tr key={`${columnName}_${statisticName}`}>
                                            {index === 0 && <td rowSpan={Object.entries(stats).length}>{columnName}</td>}
                                            <td>{statisticName}</td>
                                            <td>{value}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </Table>
                        {boxplotImage && <img src={boxplotImage} alt="Boxplot" />} {/* Afficher l'image du diagramme en boîte à moustaches */}
                    </div>
                )}
            </div>


            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    File type not accepted. Please upload a CSV or Excel file.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
