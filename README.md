# EnterpriseFlow AI - Snowflake Edition

EnterpriseFlow AI is a high-performance, single-page operations dashboard and visual agent workflow builder designed specifically for orchestrating Snowflake database clusters and Cortex AI pipelines. 

Built with rich aesthetics, crystalline glassmorphism, responsive grids, and atmospheric canvas transitions, the application enables engineers and analysts to easily deploy, monitor, and optimize autonomous workflows.

---

## 👥 Core Development Team

*   **Ranjeet Kumar (Leader)** - [rajranjeet7680@gmail.com](mailto:rajranjeet7680@gmail.com)
*   **Haris Kumar** - [hariskumarramachandran@gmail.com](mailto:hariskumarramachandran@gmail.com)
*   **Sneha Kukreja** - [snehakukreja202@gmail.com](mailto:snehakukreja202@gmail.com)
*   **Saikumar Sadam** - [saikumaryadav24680@gmail.com](mailto:saikumaryadav24680@gmail.com)

---

## 🚀 Key Features

### 1. WebGL Crystalline Loading Screen
*   Interactive, responsive space-teal WebGL fluid background reacting to cursor hover/drag movements.
*   Shimmering progress indicator cycling through deep neural initialization statuses.

### 2. Standalone Landing & Welcome Screen
*   Includes comprehensive **About** details, **Core Features Grid**, and an **Interactive Demo** visualization wrapper.
*   Shows developer credit headers profiling the engineering team.

### 3. Firebase Google SSO & Secure Login
*   Integrates Firebase App & Auth SDK popups natively.
*   Allows credentials fallback (`ADMIN_CORTEX`) for corporate accounts.
*   Redirects through: `Splash -> Welcome Page -> Login -> Workspace Selector -> Active Dashboard`.

### 4. Operations Control Room (Dashboard)
*   Real-time KPIs tracking active agents, credits burned, execution throughput, and AI confidence levels.
*   Smooth SVG visual graph charts visualizing job logs and database anomalies.
*   Dynamic telemetry feed displaying live warehouse optimizations recommended by Cortex-Search.

### 5. Draggable Node Workflow Canvas & End-to-End Simulator
*   Interactive visual drag-and-drop workspace containing custom Trigger, Action, Logic, and Notification nodes.
*   Auto-routing connection calculations drawing cubic Bezier SVG paths between node input/output sockets.
*   Collapsible sidebar panel adjusting canvas layout coordinates dynamically and triggering auto-alignment.
*   Parameter configuration drawer allowing customization of SQL scripts, model parameters, and alert formats.
*   **End-to-End Simulation**: Click the floating "Run Pipeline" button in the canvas header toolbar to trigger a step-by-step visual run.
    *   Nodes flash teal in sequence.
    *   Connecting lines light up and animate to show data flow.
    *   **Human Gate Interruptions**: Automatically suspends automated processes at approval gates and prompts administrator gate authorization.
    *   **Dynamic Slack Alerts**: Triggers Slack-themed notification toast animations upon successful completion.

### 6. Snowflake Console & SQL Runner
*   Schema inspector loading active schema databases (`LEADS`, `SESSIONS`, `SIGNUPS`).
*   Direct SQL Compiler simulating live warehouse transactions with tabular results rendering.

### 7. Cortex AI Chat Workspace
*   Model selector tuning analyst temperatures and agent personas.
*   Natural language chat assistant translating user requests into executable database optimizations.

### 8. Voice AI Helper
*   Click "Voice AI Helper" in the footer to toggle the microphone. Active state triggers a glowing canvas wave visualizer that animates voice wave bars up and down.

### 9. Cortex Code CLI Studio & End-to-End Workflow Engine
*   **Interactive Shell & Screen Recording Simulator**: Visual CLI terminal interface running automated end-to-end workflow screen recordings demonstrating **Input → Processing → Output**.
*   **Modular Skills Demonstrated**:
    1. `cortex-sql-opt`: Autonomous SQL query analysis, zero-copy micro-partitioning, and runtime optimization (+48% speedup).
    2. `cortex-anomaly-detect`: Real-time 24-hour telemetry scanning identifying financial transaction spikes ($12,000 threshold).
    3. `cortex-slack-notify`: Governance approval gate authentication and instant Slack webhook dispatching.
*   **Interactive Command Line**: Enter live commands (`cortex run`, `cortex skills`, `cortex status`, `cortex help`) directly into the embedded CLI prompt.

---

## 🛠️ Technology Stack

*   **Structure**: Semantic HTML5 (Single-Page Application architecture)
*   **Styling**: Vanilla CSS3 + Tailwind CSS CDN Configuration
*   **Authentication**: Firebase v10 Compatibility Client Auth API
*   **Icons & Typography**: Material Symbols, Google Fonts (Inter, JetBrains Mono)
*   **Logic & Telemetry**: Vanilla ES6 JavaScript (drag events, SVG managers, WebGL shaders)

---

## 📂 File Architecture

```
EnterpriseFlow-AI/
├── index.html       # Primary application frame (SPLASH, WELCOME, SHELL, DIALOGS)
├── app.css          # Customized glass-panels, radial grids, and active states
├── app.js           # Drag managers, SVG Bezier recalculations, and simulations
└── README.md        # Operations manual, team listings, and system layouts
```

---

## 🏁 How to Run Locally

1. Clone or download the directory files.
2. Open `index.html` directly in any modern web browser (Chrome, Safari, Edge, Firefox).
   *No build setup, node servers, or installation required!*
3. Interact with the elements:
   - Complete the **Google SSO / Credential Login** and choose your database environment.
   - Run the **End-to-End Simulation** from the Workflow Designer canvas top toolbar.
   - Click the **Menu Icon** next to the top header logo to collapse/expand the sidebar.
   - Run custom SQL queries in the **Snowflake Console**.
   - Speak to the **Voice AI Helper** in the footer!

---

## 📤 Git Deployment Instructions

To push this repository to GitHub, run the following commands in your command shell:

```bash
git init
git add .
git commit -m "first commit: complete EnterpriseFlow AI build"
git branch -M main
git remote add origin https://github.com/Ranjeet7680/EnterpriseFlow-AI---Snowflake-Edition.git
git push -u origin main
```
