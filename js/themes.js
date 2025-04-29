class ThemeManager {
    constructor() {
        this.themes = {
            light: 'light',
            dark: 'dark',
            system: 'system'
        };
        
        this.currentTheme = localStorage.getItem('theme') || this.themes.system;
        this.init();
    }

    init() {
        // Initialize theme
        this.applyTheme(this.currentTheme);
        
        // Add system theme change listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (this.currentTheme === this.themes.system) {
                this.applySystemTheme();
            }
        });

        // Remove theme toggle button listener (no manual toggle button)
        // Add theme select listener
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = this.currentTheme;
            themeSelect.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }
    }

    setTheme(theme) {
        if (!Object.values(this.themes).includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.applyTheme(theme);
        // No toggle icon update needed
    }

    applyTheme(theme) {
        if (theme === this.themes.system) {
            this.applySystemTheme();
        } else if (theme === this.themes.light) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        } else if (theme === this.themes.dark) {
            document.documentElement.classList.remove('light');
            document.documentElement.classList.add('dark');
        }
    }

    applySystemTheme() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDarkMode);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    // Additional theme-related utilities
    getThemeColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            primary: isDark ? '#3B82F6' : '#2563EB', // blue-500/blue-600
            background: isDark ? '#111827' : '#F9FAFB', // gray-900/gray-50
            text: isDark ? '#F9FAFB' : '#111827', // gray-50/gray-900
            border: isDark ? '#374151' : '#E5E7EB', // gray-700/gray-200
        };
    }

    // Update chart colors based on theme
    updateChartTheme(chart) {
        const colors = this.getThemeColors();
        
        if (chart && chart.options) {
            // Update grid lines
            chart.options.scales.x.grid.color = colors.border;
            chart.options.scales.y.grid.color = colors.border;
            
            // Update text colors
            chart.options.scales.x.ticks.color = colors.text;
            chart.options.scales.y.ticks.color = colors.text;
            
            // Update title colors
            if (chart.options.scales.x.title) {
                chart.options.scales.x.title.color = colors.text;
            }
            if (chart.options.scales.y.title) {
                chart.options.scales.y.title.color = colors.text;
            }
            
            chart.update();
        }
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Export theme manager for use in other modules
window.themeManager = themeManager;
