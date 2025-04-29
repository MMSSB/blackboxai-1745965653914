class GlucoseExport {
    constructor() {
        this.storage = glucoseStorage;
    }

    // Generate PDF report
    async exportToPDF() {
        try {
            const entries = this.storage.getEntries();
            const stats = this.storage.getStatistics();
            
            if (!window.jspdf) {
                throw new Error('jsPDF library not loaded');
            }
            
            const { jsPDF } = window.jspdf;
            
            // Create new PDF document
            const pdf = new jsPDF();
            const pageWidth = pdf.internal.pageSize.getWidth();
            
            // Add title
            pdf.setFontSize(20);
            pdf.setTextColor(59, 130, 246); // Blue color
            pdf.text('Glucose Report', pageWidth / 2, 20, { align: 'center' });
            
            // Add date
            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128); // Gray color
            pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, 30, { align: 'center' });
            
            // Add statistics
            pdf.setFontSize(16);
            pdf.setTextColor(31, 41, 55);
            pdf.text('Statistics', 20, 50);
            
            pdf.setFontSize(12);
            pdf.text([
                `Average Glucose: ${stats.average} mg/dL`,
                `Highest Reading: ${stats.highest} mg/dL`,
                `Lowest Reading: ${stats.lowest} mg/dL`,
                `Total Entries: ${stats.count}`
            ], 20, 60);
            
            // Add entries table
            pdf.setFontSize(16);
            pdf.text('Glucose Entries', 20, 100);
            
            // Table headers
            pdf.setFontSize(12);
            pdf.setTextColor(107, 114, 128);
            const headers = ['Date & Time', 'Glucose (mg/dL)', 'Category', 'Notes'];
            const columnWidths = [60, 35, 35, 60];
            let y = 110;
            
            headers.forEach((header, i) => {
                let x = 20;
                for (let j = 0; j < i; j++) {
                    x += columnWidths[j];
                }
                pdf.text(header, x, y);
            });
            
            // Table content
            pdf.setTextColor(31, 41, 55);
            entries.forEach((entry, index) => {
                y += 10;
                
                // Add new page if needed
                if (y > 280) {
                    pdf.addPage();
                    y = 20;
                }
                
                const row = [
                    new Date(entry.dateTime).toLocaleString(),
                    entry.glucose.toString(),
                    entry.category,
                    entry.notes || ''
                ];
                
                row.forEach((cell, i) => {
                    let x = 20;
                    for (let j = 0; j < i; j++) {
                        x += columnWidths[j];
                    }
                    // Truncate long text
                    const truncated = cell.length > 25 ? cell.substring(0, 22) + '...' : cell;
                    pdf.text(truncated, x, y);
                });
            });
            
            // Save PDF
            pdf.save('glucose-report.pdf');
            showToast('PDF exported successfully');
        } catch (error) {
            console.error('PDF generation error:', error);
            showToast('Failed to generate PDF', 'error');
        }
    }

    // Export as CSV
    async exportToImage() {
        try {
            const entries = this.storage.getEntries();
            if (!entries || entries.length === 0) {
                showToast('No data to export', 'error');
                return;
            }
            
            const csvRows = [];
            const headers = ['Date & Time', 'Glucose (mg/dL)', 'Category', 'Notes'];
            csvRows.push(headers.join(','));
            
            entries.forEach(entry => {
                const row = [
                    `"${new Date(entry.dateTime).toLocaleString()}"`,
                    entry.glucose,
                    `"${entry.category}"`,
                    `"${entry.notes ? entry.notes.replace(/"/g, '""') : ''}"`
                ];
                csvRows.push(row.join(','));
            });
            
            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `glucose-data-${new Date().toISOString().slice(0,10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showToast('CSV exported successfully');
        } catch (error) {
            console.error('CSV export error:', error);
            showToast('Failed to export CSV', 'error');
        }
    }
}

// Initialize export functionality
const glucoseExport = new GlucoseExport();

// Add event listeners for export buttons
document.getElementById('exportPDF')?.addEventListener('click', () => {
    glucoseExport.exportToPDF();
});

document.getElementById('exportImage')?.addEventListener('click', () => {
    glucoseExport.exportToImage();
});
