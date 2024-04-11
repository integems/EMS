// JavaScript Document
function downloadPage() {
    var element = document.body;
    var opt = {
        margin: 1,
        filename: 'mypage.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
}
