// let databaseColumns;
// let csvData;

// function addMappedData() {
//     handleAddData(csvData, databaseColumns);
// }

// // Function to handle parsed data and generate mapping rows
// function handleParsedData(data, databaseColumns) {
//     const mappingContainer = document.getElementById('mapping-container');
//     // Clear existing content
//     mappingContainer.innerHTML = '';
//     // Create a row for each database column
//     databaseColumns.forEach(dbColumn => {
//         // Exclude 'date_created' or other irrelevant columns
//         if (dbColumn.Field !== 'date_created') {
//             const row = document.createElement('div');
//             row.classList.add('row');
//             row.classList.add('mb-2');
//             const csvColumn = findCsvColumn(data, dbColumn.Field);
//             row.innerHTML = `
//                 <div class="col-sm-4">
//                     <label for="${dbColumn.Field}_mapping" class="form-label col-form-label">${dbColumn.Field}</label>
//                 </div>
//                 <div class="col">
//                     <select class="form-select" id="${dbColumn.Field}_mapping">
//                         <option value=""></option>
//                         ${getDropdownOptions(data[0], csvColumn)}
//                     </select>
//                 </div>
//             `;
//             mappingContainer.appendChild(row);
//         }
//     });
// }

// // Function to find CSV column for a given database column
// function findCsvColumn(data, dbColumnName) {
//     return data[0][dbColumnName] ? dbColumnName : '';
// }

// // Function to get dropdown options
// function getDropdownOptions(csvColumns, selectedCsvColumn) {
//     return Object.keys(csvColumns).map(column => {
//         const isSelected = column === selectedCsvColumn ? 'selected' : '';
//         return `<option value="${column}" ${isSelected}>${column}</option>`;
//     }).join('');
// }

// // Function to add data
// function handleAddData(csvData, databaseColumns) {
//     const mappedColumns = {};
//     let mappedData = [];
// <<<<<<< HEAD:public/js/Insert_Monitoring_Data/Air Quality/add_air_quality_data.js
//     databaseColumns.forEach(dbColumn => {
//         if (dbColumn.Field !== 'date_created') { // Check to exclude date_created
//             const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);
//             // Check if the element exists before accessing its value
//             if (dropdownElement) {
//                 const dropdownValue = dropdownElement.value;
//                 mappedColumns[dropdownValue] = dbColumn.Field;
//             } else {
//                 console.error(`Dropdown element not found for ${dbColumn.Field}`);
//             }
//         }
//     });

//     // Get selected location_id
//     const locationId = document.getElementById('select_location').value

//     for (const record of csvData) {
//         let mappedRecord = {};
//         for (const key of Object.keys(mappedColumns)) {
//             const mappedKey = mappedColumns[key];
//             const value = record[key];
//             if (mappedKey === "date") {
//                 let convertedDate = moment(record[key], "DD/MM/YYYY HH:mm").isValid()
//                     ? moment(record[key], "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
//                     : null;
//                 mappedRecord[mappedKey] = convertedDate;
//             } else {
//                 mappedRecord[mappedKey] = validateField(value) ? value : null; // Validate and handle empty strings
//             }
//         }
//         mappedRecord['location_id'] = locationId;
//         mappedData.push(mappedRecord);
//     }

//     console.log('Mapped Data:', mappedData); // Log mapped data for debugging

//     fetch('/api/air_quality/insert_air_quality_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ record: mappedData }),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 return response.json().then(err => {
//                     throw new Error(`Server error: ${err.message}`);
//                 });
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Air quality data added successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error adding air quality data:', error);
//         });
// }

// // Validation function to check field values
// function validateField(value) {
//     return value !== ' ' && !isNaN(value);
// }

// // Function to fetch database columns from the server


// // Map selected CSV columns to database columns
// databaseColumns.forEach(dbColumn => {
//     const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);

//     if (dropdownElement && dropdownElement.value) {
//         const dropdownValue = dropdownElement.value;
//         mappedColumns[dropdownValue] = dbColumn.Field;
//     } else {
//         console.warn(`No mapping selected for database column: ${dbColumn.Field}`);
//     }
// });

// // Build the array of mapped data
// csvData.forEach(record => {
//     let mappedRecord = {};

//     // Only include fields that have been mapped and contain data
//     for (let key in mappedColumns) {
//         if (record[key] !== undefined && record[key] !== null) {
//             let mappedKey = mappedColumns[key];
//             mappedRecord[mappedKey] = record[key];
//         }
//     }

//     // Include additional fields if necessary
//     mappedRecord.location_id = document.getElementById("select_location").value;

//     // Only push the record if it contains mapped data
//     if (Object.keys(mappedRecord).length > 0) {
//         mappedData.push(mappedRecord);
//     }
// });

// // Log the final mapped data to verify before sending
// console.log('Mapped Data before sending:', JSON.stringify(mappedData, null, 2));

// // Ensure that the mappedData is an array and not empty
// if (Array.isArray(mappedData) && mappedData.length > 0) {
//     fetch('/api/air_quality/insert_air_quality_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ records: mappedData }), // Adjust 'records' if the key is different
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log('Data added successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error adding data:', error);
//         });
// } else {
//     console.error('No valid data to send.');
// }
// }


// >>>>>>> d82856fa53c634f13851524071bcc1cf270ec72d:public/js/Insert Monitoring Data/Air Quality/add_air_quality_data.js
// function fetchDatabaseColumns() {
//     return fetch('/api/air_quality/air_quality_columns')
//         .then(response => response.json())
//         .then(data => data.custom);
// }

// // Event listener for file input change
// document.getElementById('data_file').addEventListener('change', () => {
//     // Fetch database columns and handle parsed data when a file is selected
//     fetchDatabaseColumns()
//         .then(dbColumns => {
//             parseCSV(dbColumns);
//             databaseColumns = dbColumns;
//         })
//         .catch(error => console.error('Error fetching database columns:', error));
// });

// // Function to parse CSV using PapaParse
// function parseCSV(databaseColumns) {
//     const fileInput = document.getElementById('data_file');
//     Papa.parse(fileInput.files[0], {
//         header: true,
//         dynamicTyping: true,
//         complete: function (results) {
//             // Handle parsed data
//             handleParsedData(results.data, databaseColumns);
//             csvData = results.data;
//         },
//         error: function (error) {
//             console.error('CSV parsing error:', error.message);
//         }
//     });
// }
//---------------------------------------------------------------------------------------------------------------------------



// // Fixed JavaScript Code
// let databaseColumns;
// let csvData;

// function addMappedData() {
//     handleAddData(csvData, databaseColumns);
// }

// // Function to handle parsed data and generate mapping rows
// function handleParsedData(data, databaseColumns) {
//     const mappingContainer = document.getElementById('mapping-container');

//     if (!data || !databaseColumns) {
//         console.error('Data or databaseColumns is undefined.');
//         return;
//     }

//     // Clear existing content
//     mappingContainer.innerHTML = '';

//     databaseColumns.forEach(dbColumn => {
//         if (dbColumn.Field !== 'date_created') {
//             const row = document.createElement('div');
//             row.classList.add('row', 'mb-2');
//             const csvColumn = findCsvColumn(data, dbColumn.Field);

//             row.innerHTML = `
//                 <div class="col-sm-4">
//                     <label for="${dbColumn.Field}_mapping" class="form-label col-form-label">${dbColumn.Field}</label>            
//                 </div>
//                 <div class="col">           
//                     <select class="form-select" id="${dbColumn.Field}_mapping">
//                         <option value=""></option>
//                         ${getDropdownOptions(data[0], csvColumn)}
//                     </select>
//                 </div>
//             `;

//             mappingContainer.appendChild(row);
//         }
//     });
// }

// // Function to find CSV column for a given database column
// function findCsvColumn(data, dbColumnName) {
//     return data[0] && data[0][dbColumnName] ? dbColumnName : '';
// }

// // Function to get dropdown options
// function getDropdownOptions(csvColumns, selectedCsvColumn) {
//     return Object.keys(csvColumns || {}).map(column => {
//         const isSelected = column === selectedCsvColumn ? 'selected' : '';
//         return `<option value="${column}" ${isSelected}>${column}</option>`;
//     }).join('');
// }

// // Function to add data
// function handleAddData(csvData, databaseColumns) {
//     if (!csvData || !databaseColumns) {
//         console.error('CSV data or database columns are undefined.');
//         return;
//     }

//     const mappedColumns = {};
//     const mappedData = [];

//     databaseColumns.forEach(dbColumn => {
//         const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);
//         if (dropdownElement) {
//             const dropdownValue = dropdownElement.value;
//             if (dropdownValue) {
//                 mappedColumns[dropdownValue] = dbColumn.Field;
//             }
//         } else {
//             console.error(`Dropdown element not found for ${dbColumn.Field}`);
//         }
//     });

//     csvData.forEach(record => {
//         const mappedRecord = {};
//         Object.keys(mappedColumns).forEach(key => {
//             const mappedKey = mappedColumns[key];
//             if (mappedKey === "start_date_time" || mappedKey === "end_date_time") {
//                 mappedRecord[mappedKey] = moment(record[key], "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm");
//             } else {
//                 mappedRecord[mappedKey] = record[key];
//             }
//         });
//         mappedRecord.location_id = document.getElementById("select_location").value;
//         mappedData.push(mappedRecord);
//     });

//     fetch('/api/air_quality/insert_air_quality_data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ record: mappedData }),
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Data added successfully:', data);
//         })
//         .catch(error => {
//             console.error('Error adding data:', error);
//         });
// }

// // Function to fetch database columns from the server
// function fetchDatabaseColumns() {
//     return fetch('/api/air_quality/air_quality_columns')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Failed to fetch database columns: ${response.statusText}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log("Fetched database columns:", data.query); // Debug
//             return data.query;
//         })
//         .catch(error => {
//             console.error('Error fetching database columns:', error);
//         });
// }


// // Event listener for file input change
// document.getElementById('data_file').addEventListener('change', () => {
//     fetchDatabaseColumns()
//         .then(dbColumns => {
//             if (!dbColumns || dbColumns.length === 0) {
//                 console.error('Database columns are empty or undefined.');
//                 return;
//             }
//             databaseColumns = dbColumns; // Save the fetched columns
//             parseCSV(); // Parse the CSV file
//         })
//         .catch(error => console.error('Error fetching database columns:', error));
// });


// // Function to parse CSV using PapaParse
// function parseCSV() {
//     const fileInput = document.getElementById('data_file');

//     if (!fileInput.files.length) {
//         console.error('No file selected.');
//         return;
//     }

//     Papa.parse(fileInput.files[0], {
//         header: true,
//         dynamicTyping: true,
//         complete: function (results) {
//             if (!results.data || results.data.length === 0) {
//                 console.error('Parsed CSV is empty.');
//                 return;
//             }
//             console.log("Parsed CSV data:", results.data); // Debug
//             csvData = results.data;
//             handleParsedData(csvData, databaseColumns);
//         },
//         error: function (error) {
//             console.error('CSV parsing error:', error.message);
//         }
//     });
// }


//-----------------------------------------------------------------------------------------------------------------------------------------------


let databaseColumns;
let csvData;

// Function to handle parsed data and generate mapping rows
function handleParsedData(data, databaseColumns) {
    const mappingContainer = document.getElementById('mapping-container');

    // Clear existing content
    mappingContainer.innerHTML = '';

    // Create a row for each database column
    databaseColumns.custom.forEach(dbColumn => {
        // Exclude 'date_created' and any columns with null Field
        if (dbColumn.Field && dbColumn.Field !== 'date_created') {
            const row = document.createElement('div');
            row.classList.add('row');
            row.classList.add('mb-2');
            const csvColumn = findCsvColumn(data, dbColumn.Field);

            row.innerHTML = `
                <div class="col-sm-4">
                    <label for="${dbColumn.Field}_mapping" class="form-label col-form-label">${dbColumn.Field}</label>            
                </div>
                <div class="col">           
                    <select class="form-select" id="${dbColumn.Field}_mapping">
                        <option value=""></option>
                        ${getDropdownOptions(data[0], csvColumn)}
                    </select>
                </div>
            `;

            mappingContainer.appendChild(row);
        }
    });
}

// Function to find CSV column for a given database column
function findCsvColumn(data, dbColumnName) {
    return data[0][dbColumnName] ? dbColumnName : '';
}

// Function to get dropdown options
function getDropdownOptions(csvColumns, selectedCsvColumn) {
    return Object.keys(csvColumns).map(column => {
        const isSelected = column === selectedCsvColumn ? 'selected' : '';
        return `<option value="${column}" ${isSelected}>${column}</option>`;
    }).join('');
}

// Function to convert date to a valid MySQL datetime format
function convertToValidDatetime(inputDate) {
    // Specifically handle DD/MM/YYYY format
    const parts = inputDate.split('/');
    if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];

        // Create a date in the format YYYY-MM-DD with a default time of 00:00:00
        return `${year}-${month}-${day} 00:00:00`;
    }

    // Fallback to moment.js parsing if the format is unexpected
    const parsedDate = moment(inputDate, 'DD/MM/YYYY');
    if (parsedDate.isValid()) {
        return parsedDate.format('YYYY-MM-DD HH:mm:ss');
    }

    // If no format works, log a warning and return current datetime
    console.warn(`Could not parse date: ${inputDate}`);
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

// Function to add data
function handleAddData(csvData, databaseColumns) {
    const mappedColumns = {};
    let mappedData = [];

    // Collect mapped columns
    databaseColumns.custom.forEach(dbColumn => {
        if (dbColumn.Field && dbColumn.Field !== 'date_created') {
            const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);

            // Check if the element exists before accessing its value
            if (dropdownElement) {
                const dropdownValue = dropdownElement.value;
                if (dropdownValue) {
                    mappedColumns[dropdownValue] = dbColumn.Field;
                }
            } else {
                console.warn(`Dropdown element not found for ${dbColumn.Field}`);
            }
        }
    });

    // Process each record
    for (let record of csvData) {
        let mappedRecord = {};

        // Map selected columns
        for (let key of Object.keys(mappedColumns)) {
            let mappedKey = mappedColumns[key];

            // Special handling for date conversion
            if (mappedKey === 'date') {
                try {
                    mappedRecord[mappedKey] = convertToValidDatetime(record[key]);
                } catch (error) {
                    console.error(`Error converting date for ${key}:`, error);
                    // Skip this record or use current datetime
                    mappedRecord[mappedKey] = moment().format('YYYY-MM-DD HH:mm:ss');
                }
            } else {
                // Handle numeric columns, converting to null if invalid
                const numericColumns = ['CO_ppm', 'NO2_ppm', 'PM10_ppm', 'PM2_5_ppm', 'RH_percentage', 'SO2_ppm', 'temp_C'];

                if (numericColumns.includes(mappedKey)) {
                    // Convert to number, use null if NaN
                    const numValue = Number(record[key]);
                    mappedRecord[mappedKey] = isNaN(numValue) ? null : numValue;
                } else {
                    mappedRecord[mappedKey] = record[key];
                }
            }
        }

        // Add location ID and current timestamp for date_created
        mappedRecord.location_id = $("#select_location").val();
        mappedRecord.date_created = moment().format('YYYY-MM-DD HH:mm:ss');

        mappedData.push(mappedRecord);
    }

    // Send data to air quality API
    fetch('/api/air_quality/insert_air_quality_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record: mappedData }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Air Quality Data added successfully:', data);
            // Trigger success notification
            if (typeof notifies1?.success === 'function') {
                notifies1.success('Air Quality Data Added Successfully');
            } else {
                console.warn('notifies1.success is not a function');
            }
        })
        .catch(error => {
            console.error('Error adding Air Quality data:', error);
            // Trigger error notification
            if (typeof notifies1?.error === 'function') {
                notifies1.error('Failed to Add Air Quality Data');
            } else {
                console.warn('notifies1.error is not a function');
            }
        });
}

// Function to fetch database columns from the server
function fetchDatabaseColumns() {
    return fetch('/api/air_quality/air_quality_columns')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching database columns:', error);
            throw error;
        });
}

// Event listener for file input change
document.getElementById('data_file').addEventListener('change', () => {
    // Fetch database columns and handle parsed data when a file is selected
    fetchDatabaseColumns()
        .then(dbColumns => {
            parseCSV(dbColumns);
            databaseColumns = dbColumns;
        })
        .catch(error => {
            console.error('Error in file change handler:', error);
            if (typeof notifies1?.error === 'function') {
                notifies1.error('Failed to Load Database Columns');
            } else {
                console.warn('notifies1.error is not a function');
            }
        });
});

// Function to parse CSV using PapaParse
function parseCSV(databaseColumns) {
    const fileInput = document.getElementById('data_file');

    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
            // Validate that we have data
            if (results.data && results.data.length > 0) {
                // Handle parsed data
                handleParsedData(results.data, databaseColumns);
                csvData = results.data;
            } else {
                console.error('No data found in the CSV file');
                if (typeof notifies1?.error === 'function') {
                    notifies1.error('No data found in the CSV file');
                } else {
                    console.warn('notifies1.error is not a function');
                }
            }
        },
        error: function (error) {
            console.error('CSV parsing error:', error.message);
            if (typeof notifies1?.error === 'function') {
                notifies1.error('Failed to Parse CSV File');
            } else {
                console.warn('notifies1.error is not a function');
            }
        }
    });
}

// Expose handleAddData globally if needed for modal submit
function addMappedData() {
    if (csvData && csvData.length > 0) {
        handleAddData(csvData, databaseColumns);
    } else {
        console.error('No data to submit');
        if (typeof notifies1?.error === 'function') {
            notifies1.error('Please select and parse a CSV file first');
        } else {
            console.warn('notifies1.error is not a function');
        }
    }
}

