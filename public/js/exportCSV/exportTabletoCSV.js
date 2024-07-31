// JavaScript Document

function exportTableToCSV(filename) {
    // Get the table element
    var table = document.querySelector('#data_table'); // Replace with your table's ID

    // Extract headers
    var headers = [];
    for (var i = 0; i < table.rows[0].cells.length; i++) {
        headers.push(table.rows[0].cells[i].innerText);
    }

    // Extract data
    var data = [];
    for (var i = 1; i < table.rows.length; i++) {
        var tableRow = table.rows[i];
        var rowData = [];
        for (var j = 0; j < tableRow.cells.length; j++) {
            rowData.push(tableRow.cells[j].innerText);
        }
        data.push(rowData.join(","));
    }

    // Combine headers and data
    var csv = headers.join(",") + "\n" + data.join("\n");

    // Create download link
    var downloadLink = document.createElement("a");
    var blob = new Blob(["\ufeff", csv]);
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = filename;

    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}