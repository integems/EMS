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

    databaseColumns.forEach(dbColumn => {
        const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);

        if (dropdownElement) {
            const dropdownValue = dropdownElement.value;
            mappedColumns[dropdownValue] = dbColumn.Field;
        } else {
            console.error(`Dropdown element not found for ${dbColumn.Field}`);
        }
    });

    csvData.forEach(record => {
        let mappedRecord = {};
        for (let key in mappedColumns) {
            let mappedKey = mappedColumns[key];
            mappedRecord[mappedKey] = record[key];
        }
        mappedRecord.location_id = document.getElementById("select_location").value;
        mappedData.push(mappedRecord);
    });

    console.log('Mapped Data:', mappedData); // Log the mapped data before sending

    fetch('/api/air_quality/insert_air_quality_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record: mappedData }),
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
