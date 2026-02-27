battinala-admin/
├── public/
│   ├── batti-nala.png          ← your logo here
│   ├── vite.svg
│   └── favicon.ico
├── src/
│   ├── api/                    # all backend calls go here
│   │   ├── index.js            # axios or fetch setup + base URL
│   │   ├── auth.js             # login, logout functions
│   │   └── hazards.js          # get hazards, update status, etc.
│   ├── assets/                 # images & icons you import
│   │   └── react.svg
│   ├── components/             # reusable pieces
│   │   ├── common/             # basic building blocks
│   │   │   ├── StatCard.jsx
│   │   │   ├── Badge.jsx       # for status/priority
│   │   │   └── Button.jsx      # if you want reusable buttons
│   │   ├── layout/             # layout wrappers
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx  # sidebar + header + content area
│   │   ├── dashboard/          # dashboard-specific
│   │   │   ├── HazardStats.jsx
│   │   │   └── HighlightCard.jsx
│   │   └── reports/            # table & filters
│   │       ├── HazardTable.jsx
│   │       ├── ReportsFilter.jsx
│   │       └── ExportButton.jsx
│   ├── hooks/                  # custom hooks (data fetching, logic)
│   │   ├── useAuth.js
│   │   ├── useHazards.js       # fetches hazards + loading/error
│   │   └── useReports.js
│   ├── pages/                  # full-screen views (routed pages)
│   │   ├── LoginPage.jsx
│   │   └── DepartmentDashboardPage.jsx   ← renamed from DashboardView
│   ├── utils/                  # helper functions (no React)
│   │   ├── formatDate.js
│   │   └── exportCSV.js
│   ├── App.jsx                 # routing + main layout
│   ├── main.jsx                # entry point
│   └── index.css               # tailwind + global styles
├── .env                        # VITE_API_URL=...
├── package.json
└── vite.config.js