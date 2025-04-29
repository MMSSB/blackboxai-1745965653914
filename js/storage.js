class GlucoseStorage {
    constructor() {
        this.storageKey = 'glucoseEntries';
    }

    // Get all entries
    getEntries() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    // Add new entry
    addEntry(entry) {
        const entries = this.getEntries();
        entries.push(entry);
        localStorage.setItem(this.storageKey, JSON.stringify(entries));
        return entries;
    }

    // Delete entry
    deleteEntry(dateTime) {
        const entries = this.getEntries();
        const filteredEntries = entries.filter(entry => entry.dateTime !== dateTime);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredEntries));
        return filteredEntries;
    }

    // Export to .diab format
    exportToDiab() {
        const entries = this.getEntries();
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            settings: JSON.parse(localStorage.getItem('glucoseSettings') || '{}'),
            entries: entries
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `glucose-data-${new Date().toISOString().slice(0,10)}.diab`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Import from .diab file
    importFromDiab(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate file format
                    if (!data.version || !data.entries) {
                        throw new Error('Invalid file format');
                    }
                    
                    // Import settings if available
                    if (data.settings) {
                        localStorage.setItem('glucoseSettings', JSON.stringify(data.settings));
                    }
                    
                    // Import entries
                    localStorage.setItem(this.storageKey, JSON.stringify(data.entries));
                    resolve(data.entries);
                } catch (error) {
                    reject(new Error('Failed to import file: ' + error.message));
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    // Backup data
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            entries: this.getEntries(),
            settings: JSON.parse(localStorage.getItem('glucoseSettings') || '{}')
        };
        
        const backups = JSON.parse(localStorage.getItem('glucoseBackups') || '[]');
        backups.push(backup);
        
        // Keep only last 5 backups
        if (backups.length > 5) {
            backups.shift();
        }
        
        localStorage.setItem('glucoseBackups', JSON.stringify(backups));
        return backup;
    }

    // Restore from backup
    restoreFromBackup(timestamp) {
        const backups = JSON.parse(localStorage.getItem('glucoseBackups') || '[]');
        const backup = backups.find(b => b.timestamp === timestamp);
        
        if (!backup) {
            throw new Error('Backup not found');
        }
        
        localStorage.setItem(this.storageKey, JSON.stringify(backup.entries));
        localStorage.setItem('glucoseSettings', JSON.stringify(backup.settings));
        
        return backup;
    }

    // Clear all data
    clearData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem('glucoseSettings');
    }

    // Get statistics
    getStatistics() {
        const entries = this.getEntries();
        if (entries.length === 0) {
            return {
                average: 0,
                highest: 0,
                lowest: 0,
                count: 0
            };
        }

        const glucoseLevels = entries.map(entry => parseFloat(entry.glucose));
        return {
            average: Math.round(glucoseLevels.reduce((a, b) => a + b) / glucoseLevels.length),
            highest: Math.max(...glucoseLevels),
            lowest: Math.min(...glucoseLevels),
            count: entries.length
        };
    }

    // Get entries by date range
    getEntriesByDateRange(startDate, endDate) {
        const entries = this.getEntries();
        return entries.filter(entry => {
            const entryDate = new Date(entry.dateTime);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    // Get entries by category
    getEntriesByCategory(category) {
        const entries = this.getEntries();
        return entries.filter(entry => entry.category === category);
    }
}

// Initialize storage
const glucoseStorage = new GlucoseStorage();

// Add file import handler
document.getElementById('importDiab')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        const entries = await glucoseStorage.importFromDiab(file);
        showToast('Data imported successfully');
        location.reload(); // Refresh to show imported data
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Export handler
document.getElementById('exportDiab')?.addEventListener('click', () => {
    glucoseStorage.exportToDiab();
    showToast('Data exported successfully');
});
