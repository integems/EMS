// JavaScript Document
let databaseColumns;
let csvData;


function addMappedData() {
    handleAddData(csvData, databaseColumns)
}


// Function to handle parsed data and generate mapping rows
function handleParsedData(data, databaseColumns) {
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
            const csvData = data;

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



// Function to add data
function handleAddData(csvData, databaseColumns) {

    const mappedColumns = {};
    let mappedData = [];

    databaseColumns.forEach(dbColumn => {
        const dropdownElement = document.getElementById(`${dbColumn.Field}_mapping`);

        // Check if the element exists before accessing its value
        if (dropdownElement) {
            const dropdownValue = dropdownElement.value;
            mappedColumns[dropdownValue] = dbColumn.Field;
        } else {
            console.error(`Dropdown element not found for ${dbColumn.Field}`);
        }
    });

    for (record of csvData) {
        let mappedRecord = {}
        for (key of Object.keys(mappedColumns)) {
            let mappedKey = mappedColumns[key]
            if (mappedKey == "start_date_time" || mappedKey == "end_date_time") {

                let convertedDate = moment(record[key], "DD/MM/YYYY HH:mm").format("YYYY-MM-DD HH:mm")
                mappedRecord[mappedKey] = convertedDate;

            } else {
                mappedRecord[mappedKey] = record[key]
            }

        }
        mappedRecord.location_id = $("#select_location").val()
        mappedData.push(mappedRecord)
    }
    // console.log(mappedData);


    fetch('/api/noise/insert_noise_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ record: mappedData }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Data added successfully:', data);
        })
        .catch(error => {
            console.error('Error adding data:', error);
        });

}



// Function to fetch database columns from the server
function fetchDatabaseColumns() {
    return fetch('/api/noise/noise_data_columns')
        .then(response => response.json())
        .then(data => data.query);


}
// console.log(fetchDatabaseColumns)



// Event listener for file input change
document.getElementById('data_file').addEventListener('change', () => {
    // Fetch database columns and handle parsed data when a file is selected
    fetchDatabaseColumns()
        .then(dbColumns => {
            parseCSV(dbColumns);
            databaseColumns = dbColumns
        })
        .catch(error => console.error('Error fetching database columns:', error));
});



// Function to parse CSV using PapaParse
function parseCSV(databaseColumns) {
    const fileInput = document.getElementById('data_file');

    Papa.parse(fileInput.files[0], {
        header: true,
        dynamicTyping: true,
        complete: function (results) {
            // Handle parsed data
            handleParsedData(results.data, databaseColumns);
            csvData = results.data;
        },
        error: function (error) {
            console.error('CSV parsing error:', error.message);
        }
    });
}
