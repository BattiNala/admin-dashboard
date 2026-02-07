## Project Structure of BattiNala Admin View

```t
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