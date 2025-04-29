
Built by https://www.blackbox.ai

---

```markdown
# GlucoTrack - Smart Diabetes Management

GlucoTrack is a web-based application designed for effective diabetes management. It allows users to log their glucose levels, track trends over time, and manage their health data efficiently. With an easy-to-use interface and various features for monitoring and exporting data, GlucoTrack aims to simplify diabetes management for users.

## Table of Contents
- [Project Overview](#project-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Project Structure](#project-structure)

## Project Overview

GlucoTrack provides users with functionality to:
- Log glucose levels with timestamps.
- Visualize glucose trends using charts.
- Export data in various formats including CSV and PDF.
- Maintain a history of entries to track health effectively.

## Installation

To run the GlucoTrack application locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/glucotrack.git
   ```

2. Move into the project directory:
   ```bash
   cd glucotrack
   ```

3. Open `index.html` in a web browser to start using the application.

## Usage

GlucoTrack allows users to:
- Quickly enter glucose levels along with date and time.
- Choose categories for each entry.
- Navigate to the history section to view and filter past entries.
- Export the glucose data in varied formats such as CSV and PDF for further analysis.

### Navigating the App

- **Dashboard**: View current statistics and trends.
- **History**: Access past glucose entries and filter them by categories.
- **Settings**: Customize your user profile and application preferences, such as units of measurement and themes.

## Features

- User-friendly interface utilizing **Tailwind CSS** for responsive design.
- Interactive charts to visualize glucose levels using **Chart.js**.
- Export functionalities to save data in multiple formats (CSV, PDF, etc.).
- Theme selection (light/dark) based on user preference.
- Features like setting user name and selecting measurement units (mg/dL or mmol/L).
- Toast notifications for user interactions.

## Dependencies

This project uses several libraries and frameworks. Below are the key dependencies listed in the project:

- **Tailwind CSS** - For styling
- **Font Awesome** - For icons
- **Chart.js** - For rendering charts
- **jsPDF** - For generating PDF files
- **html2canvas** - For exporting data as images
- **Luxon** - For date and time handling

## Project Structure

```
/glucotrack
 ├── index.html           # Main dashboard page
 ├── history.html         # Page for viewing historical glucose data
 ├── settings.html        # Page for adjusting user settings
 ├── js/                  # JavaScript files
 │   ├── app.js           # Main application logic
 │   ├── export.js        # Logic for exporting data
 │   ├── settings.js      # Logic for managing user settings
 │   ├── storage.js       # Logic for localStorage operations
 │   └── themes.js        # Logic for managing themes
 └── css/                 # CSS files (if any)
```

## Conclusion

GlucoTrack is designed to be a comprehensive tool for individuals looking to manage diabetes effectively. The application is easy to deploy and navigate. By logging and analyzing glucose levels, users can maintain a healthier lifestyle.

For any issues or contributions, please check the GitHub repository or file an issue.
```