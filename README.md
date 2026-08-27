# 📅 UIT Scheduler

An automated class scheduling and timetable management tool designed specifically to help students build conflict-free schedules effortlessly from Excel data.

## 🌟 Introduction

Registering for classes and arranging a timetable manually can be time-consuming and prone to human error. **UIT Scheduler** is a client-side web application that solves this problem. Users can simply upload their university's provided Excel timetable file, input their desired course codes, and let the system automatically generate a visual schedule while actively preventing time conflicts.

## ✨ Key Features

- **Excel Data Parsing:** Directly reads and processes `.xlsx` or `.xls` files in the browser without needing a backend server.
- **Smart Filtering:** Quickly search and select courses by class codes.
- **Conflict Detection:** Automatically warns users if a selected class overlaps with existing ones in the schedule.
- **Visual Timetable:** Renders a clear, easy-to-read weekly calendar grid.
- **100% Client-Side:** Fast, secure, and privacy-focused as no data is uploaded to external servers.

## 🛠️ Tech Stack

- **Core:** React, TypeScript, Vite
- **Data Processing:** SheetJS (`xlsx`)
- **Styling:** CSS / Tailwind CSS (Optional)

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation

**1. Clone this repository:**

```bash
git clone [https://github.com/hieupcm03/uit_scheduler.git](https://github.com/hieupcm03/uit_scheduler.git)
```

**2. Navigate into the project directory:**

```bash
cd uit_scheduler
```

**3. Install the required dependencies:**

```bash
npm install
```

**4. Start the development server:**

```bash
npm run dev
```

**5. View the app:**
Open your browser and visit `http://localhost:5173/` to view the application.

## 💡 How to Use

- **Step 1:** Click the **Upload** button to select your `.xlsx` timetable file.
- **Step 2:** Enter the specific **Class Code** (e.g., `SE104.P11`) you want to register for.
- **Step 3:** Click **Add to Schedule**. The system will verify if it fits and display it on the grid.
