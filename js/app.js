// Initialize DateTime
function initDateTime() {
    const now = new Date();
    const dateTimeInput = document.getElementById('dateTime');
    dateTimeInput.value = now.toISOString().slice(0, 16);
}

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('glucoseChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Glucose Levels',
                data: [],
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Glucose Level (mg/dL)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date & Time'
                    }
                }
            }
        }
    });
    return chart;
}

// Show Toast Message
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Update Statistics
function updateStats(entries) {
    if (entries.length === 0) return;
    
    const glucoseLevels = entries.map(entry => parseFloat(entry.glucose));
    const average = glucoseLevels.reduce((a, b) => a + b) / glucoseLevels.length;
    const latest = glucoseLevels[glucoseLevels.length - 1];
    
    document.querySelector('.grid-cols-2 .text-2xl').textContent = `${Math.round(average)} mg/dL`;
    document.querySelectorAll('.grid-cols-2 .text-2xl')[1].textContent = `${latest} mg/dL`;
}

// Update Chart
function updateChart(chart, entries) {
    const labels = entries.map(entry => {
        const date = new Date(entry.dateTime);
        return date.toLocaleString();
    });
    
    const data = entries.map(entry => entry.glucose);
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Add Entry to Table
function addEntryToTable(entry) {
    const tbody = document.getElementById('entriesTable');
    const row = document.createElement('tr');
    
    const date = new Date(entry.dateTime).toLocaleString();
    
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${date}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${entry.glucose} mg/dL</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${entry.category}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${entry.notes}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button class="text-red-600 hover:text-red-900 delete-entry" data-time="${entry.dateTime}">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    tbody.insertBefore(row, tbody.firstChild);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initDateTime();
    const chart = initChart();
    
    // Load existing entries
    const entries = JSON.parse(localStorage.getItem('glucoseEntries') || '[]');
    entries.forEach(entry => addEntryToTable(entry));
    updateStats(entries);
    updateChart(chart, entries);
    
    // Save Entry
    document.getElementById('saveEntry').addEventListener('click', () => {
        const dateTime = document.getElementById('dateTime').value;
        const glucose = document.getElementById('glucoseLevel').value;
        const category = document.getElementById('category').value;
        const notes = document.getElementById('notes').value;
        
        if (!dateTime || !glucose) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const entry = { dateTime, glucose, category, notes };
        const entries = JSON.parse(localStorage.getItem('glucoseEntries') || '[]');
        entries.push(entry);
        localStorage.setItem('glucoseEntries', JSON.stringify(entries));
        
        addEntryToTable(entry);
        updateStats(entries);
        updateChart(chart, entries);
        
        // Reset form
        document.getElementById('glucoseLevel').value = '';
        document.getElementById('notes').value = '';
        initDateTime();
        
        showToast('Entry saved successfully');
    });
    
    // Delete Entry
    document.getElementById('entriesTable').addEventListener('click', (e) => {
        if (e.target.closest('.delete-entry')) {
            const button = e.target.closest('.delete-entry');
            const dateTime = button.dataset.time;
            
            let entries = JSON.parse(localStorage.getItem('glucoseEntries') || '[]');
            entries = entries.filter(entry => entry.dateTime !== dateTime);
            localStorage.setItem('glucoseEntries', JSON.stringify(entries));
            
            button.closest('tr').remove();
            updateStats(entries);
            updateChart(chart, entries);
            
            showToast('Entry deleted successfully');
        }
    });
});
