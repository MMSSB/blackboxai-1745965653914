class SettingsManager {
    constructor() {
        this.defaultSettings = {
            userName: 'User',
            units: 'mgdl', // mgdl or mmol
            theme: 'system',
            language: 'en',
            targetRanges: {
                low: 70,
                high: 180
            },
            notifications: {
                enabled: true,
                highAlert: true,
                lowAlert: true
            },
            display: {
                timeFormat: '24h', // 12h or 24h
                dateFormat: 'YYYY-MM-DD',
                glucoseDecimals: 0
            }
        };

        this.settings = this.loadSettings();
        this.init();
    }

    init() {
        // Initialize settings modal
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettings = document.getElementById('closeSettings');
        const saveSettings = document.getElementById('saveSettings');

        if (settingsBtn && settingsModal) {
            // Show settings modal
            settingsBtn.addEventListener('click', () => {
                this.populateSettingsForm();
                settingsModal.classList.remove('hidden');
            });

            // Close settings modal
            closeSettings?.addEventListener('click', () => {
                settingsModal.classList.add('hidden');
            });

            // Save settings
            saveSettings?.addEventListener('click', () => {
                this.saveSettingsFromForm();
                settingsModal.classList.add('hidden');
                showToast('Settings saved successfully');
            });

            // Close modal when clicking outside
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    settingsModal.classList.add('hidden');
                }
            });
        }

        // Apply initial settings
        this.applySettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('glucoseSettings');
        return savedSettings ? 
            { ...this.defaultSettings, ...JSON.parse(savedSettings) } : 
            { ...this.defaultSettings };
    }

    saveSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('glucoseSettings', JSON.stringify(this.settings));
        this.applySettings();
    }

    populateSettingsForm() {
        // User Name
        const userNameInput = document.getElementById('userName');
        if (userNameInput) {
            userNameInput.value = this.settings.userName;
        }

        // Units
        const unitsSelect = document.getElementById('units');
        if (unitsSelect) {
            unitsSelect.value = this.settings.units;
        }

        // Theme
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.settings.theme;
        }
    }

    saveSettingsFromForm() {
        const newSettings = {
            userName: document.getElementById('userName')?.value || this.settings.userName,
            units: document.getElementById('units')?.value || this.settings.units,
            theme: document.getElementById('themeSelect')?.value || this.settings.theme
        };

        this.saveSettings(newSettings);
    }

    applySettings() {
        // Apply theme
        if (window.themeManager) {
            window.themeManager.setTheme(this.settings.theme);
        }

        // Apply units
        this.updateUnitsDisplay();

        // Update username display
        this.updateUserNameDisplay();
    }

    updateUnitsDisplay() {
        const unitLabels = document.querySelectorAll('.glucose-unit');
        const unitText = this.settings.units === 'mgdl' ? 'mg/dL' : 'mmol/L';
        
        unitLabels.forEach(label => {
            label.textContent = unitText;
        });

        // Update chart y-axis label
        const glucoseChart = Chart.getChart('glucoseChart');
        if (glucoseChart) {
            glucoseChart.options.scales.y.title.text = `Glucose Level (${unitText})`;
            glucoseChart.update();
        }
    }

    updateUserNameDisplay() {
        const userNameDisplay = document.querySelector('.user-name');
        if (userNameDisplay) {
            userNameDisplay.textContent = this.settings.userName;
        }
    }

    // Convert between mg/dL and mmol/L
    convertGlucoseValue(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        
        if (fromUnit === 'mgdl' && toUnit === 'mmol') {
            return +(value / 18.0182).toFixed(1);
        } else if (fromUnit === 'mmol' && toUnit === 'mgdl') {
            return Math.round(value * 18.0182);
        }
        
        return value;
    }

    // Get target ranges based on current units
    getTargetRanges() {
        const { low, high } = this.settings.targetRanges;
        if (this.settings.units === 'mmol') {
            return {
                low: this.convertGlucoseValue(low, 'mgdl', 'mmol'),
                high: this.convertGlucoseValue(high, 'mgdl', 'mmol')
            };
        }
        return { low, high };
    }

    // Format glucose value based on settings
    formatGlucoseValue(value) {
        const converted = this.settings.units === 'mmol' ? 
            this.convertGlucoseValue(value, 'mgdl', 'mmol') : 
            value;
        
        return this.settings.units === 'mmol' ? 
            converted.toFixed(1) : 
            Math.round(converted);
    }

    // Format date based on settings
    formatDate(date) {
        const d = new Date(date);
        const format = this.settings.display.timeFormat === '12h' ? 
            'MM/DD/YYYY hh:mm A' : 
            this.settings.display.dateFormat + ' HH:mm';
        
        return luxon.DateTime.fromJSDate(d).toFormat(format);
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();

// Export settings manager for use in other modules
window.settingsManager = settingsManager;
