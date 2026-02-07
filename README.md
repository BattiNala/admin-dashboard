# admin-dashboard
⚡ BattiNala - Admin Dashboard

BattiNala is a specialized citizen-to-authority gateway designed to report and resolve urban infrastructure failures in Kathmandu and Lalitpur, specifically focusing on electricity and sewage systems.This dashboard serves as the central command center for municipal authorities to manage reports, track repairs, and optimize staff logistics.

 🌟 Key Features
- Real-time Visualization: High-risk physical infrastructure faults are visualized on a live-mapping dashboard.
- Interactive Analytics: Monthly trends and status distribution charts using Recharts.
- Logistical Intelligence: Uses the **A* Search Algorithm** to provide staff with optimized navigation paths to hazard sites, potentially reducing travel time by 15-20%.
- Fraud Prevention: Technical filtering mechanisms to remove fraudulent reports and manage system quality.

 🏗️ Technical Stack
- Frontend: ReactJS (Responsive Web Layout).
- Backend: FastAPI (RESTful APIs) 
- Database: PostgreSQL with PostGIS for geographic data .
- Mapping: OpenStreetMap (OSM) 

 📂 Project Structure
## 📂 Project Structure

battinala-admin/
├── public/                # Static assets (logos, favicons)
├── src/
│   ├── assets/            # Images, icons, and global CSS
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Buttons, Inputs, Loaders, Layouts
│   │   ├── dashboard/     # Stats cards, Charts (Recharts)
│   │   ├── reports/       # Table, Filters, Export buttons
│   │   └── auth/          # Login forms, Security warnings
│   ├── context/           # React Context for global State (Auth, Theme)
│   ├── hooks/             # Custom hooks (useReports, useStats)
│   ├── services/          # API calls to your FastAPI backend
│   ├── utils/             # Formatting (date helpers, CSV exporters)
│   ├── views/             # Page-level components
│   │   ├── LoginView.jsx
│   │   ├── DashboardView.jsx
│   │   └── ReportsView.jsx
│   ├── App.jsx            # Routing logic (React Router)
│   └── main.jsx           # Entry point
├── .env                   # Backend API URLs
└── package.json           # Project dependencies

🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- NPM

 Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/BattiNala/admin-dashboard.git](https://github.com/BattiNala/admin-dashboard.git)
