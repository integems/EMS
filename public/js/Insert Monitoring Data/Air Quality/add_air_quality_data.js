let databaseColumns;
let csvData;

function addMappedData() {
    handleAddData(csvData, databaseColumns);
}

function handleParsedData(data, databaseColumns) {
    if (!databaseColumns) {
        console.error('Database columns are not defined');
        return;
    }

    const mappingContainer = document.getElementById('mapping-container');

    // Clear existing content
    mappingContainer.innerHTML = '';

    // Create a row for each database column
    databaseColumns.forEach(dbColumn => {
        // Exclude 'date_created' column
        if (dbColumn.Field !== 'date_created') {
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

function findCsvColumn(data, dbColumnName) {
    return data[0][dbColumnName] ? dbColumnName : '';
}

function getDropdownOptions(csvColumns, selectedCsvColumn) {
    return Object.keys(csvColumns).map(column => {
        const isSelected = column === selectedCsvColumn ? 'selected' : '';
        return `<option value="${column}" ${isSelected}>${column}</option>`;
    }).join('');
}

function handleAddData(csvData, databaseColumns) {
    const mappedColumns = {};
    let mappedData = [];

    // Map selected CSV columns to database columns
    databaseColumns.forEach(dbColumn => {
        const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);

        if (dropdownElement && dropdownElement.value) {
            const dropdownValue = dropdownElement.value;
            mappedColumns[dropdownValue] = dbColumn.Field;
        } else {
            console.warn(`No mapping selected for database column: ${dbColumn.Field}`);
        }
    });

    // Build the array of mapped data
    csvData.forEach(record => {
        let mappedRecord = {};

        // Only include fields that have been mapped and contain data
        for (let key in mappedColumns) {
            if (record[key] !== undefined && record[key] !== null) {
                let mappedKey = mappedColumns[key];
                mappedRecord[mappedKey] = record[key];
            }
        }

        // Include additional fields if necessary
        mappedRecord.location_id = document.getElementById("select_location").value;

        // Only push the record if it contains mapped data
        if (Object.keys(mappedRecord).length > 0) {
            mappedData.push(mappedRecord);
        }
    });

    // Log the final mapped data to verify before sending
    console.log('Mapped Data before sending:', JSON.stringify(mappedData, null, 2));

    // Ensure that the mappedData is an array and not empty
    if (Array.isArray(mappedData) && mappedData.length > 0) {
        fetch('/api/air_quality/insert_air_quality_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ records: mappedData }), // Adjust 'records' if the key is different
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data added successfully:', data);
            })
            .catch(error => {
                console.error('Error adding data:', error);
            });
    } else {
        console.error('No valid data to send.');
    }
}


function fetchDatabaseColumns() {
    return fetch('/api/air_quality/air_quality_columns')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched Database Columns:', data);
            return data.custom; // Adjusted to match the correct property
        });
}

document.getElementById('data_file').addEventListener('change', () => {
    console.log('File input changed');
    fetchDatabaseColumns()
        .then(dbColumns => {
            console.log('Database Columns Fetched:', dbColumns);
            parseCSV(dbColumns);
            databaseColumns = dbColumns;
        })
        .catch(error => console.error('Error fetching database columns:', error));
});

function parseCSV(databaseColumns) {
    const fileInput = document.getElementById('data_file');

    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            console.log('CSV Parsed:', results.data);
            handleParsedData(results.data, databaseColumns);
            csvData = results.data;
        },
        error: function (error) {
            console.error('CSV parsing error:', error.message);
        }
    });
}
