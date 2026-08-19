# Quick Reference Guide
## ClimaSync.AI Disaster Management Workflow

---

## 🚀 Quick Start

### Start All Services
```bash
# Terminal 1: Backend
cd F:\ClimasyncAI_backend
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd F:\ClimaSyncAI_frontend
npm run dev

# Terminal 3: Risk Analysis Agent
cd F:\ClimasyncAI_Agents\Risk_Analysis
uvicorn main:app --reload --port 8002

# Terminal 4: Precautionary Agent
cd F:\ClimaSyncAI_dataCollection_Microservice
uvicorn main:app --reload --port 8003
```

---

## 📋 API Endpoints Summary

### Admin Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/auth/create` | Create admin account |
| POST | `/api/admin/auth/login` | Admin login |

### Threshold Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/threshold-alerts` | Create alert (from agent) |
| GET | `/api/admin/threshold-alerts` | Get all alerts |
| GET | `/api/admin/threshold-alerts/{id}` | Get single alert |
| POST | `/api/admin/threshold-alerts/{id}/acknowledge` | Acknowledge alert |

### Risk Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/risk-analysis/request` | Request analysis |
| GET | `/api/admin/risk-analysis/{id}` | Get analysis result |
| GET | `/api/admin/risk-analysis` | Get all analyses |

### Precautionary Measures
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/precautionary/request` | Request measures |
| GET | `/api/precautionary/{id}` | Get measures result |
| GET | `/api/precautionary` | Get all measures |
| POST | `/api/precautionary/{id}/approve` | Approve measures |

---

## 🔑 Environment Variables

### Backend (.env.local)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/climasync_db
SECRET_KEY=your-secret-key
RISK_ANALYSIS_AGENT_URL=http://localhost:8002
PRECAUTIONARY_AGENT_URL=http://localhost:8003
AGENT_API_KEY=climasync-agent-secure-key-2026
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 📁 File Structure

### Frontend (New Files)
```
app/
├── admin/
│   ├── create-account/
│   │   └── page.tsx                    ✅ NEW
│   └── threshold-alerts/
│       └── page.tsx                    ✅ UPDATED
├── _lib/
│   ├── admin/
│   │   ├── adminAuthService.ts         ✅ NEW
│   │   ├── thresholdAlertService.ts    ✅ NEW
│   │   ├── riskAnalysisService.ts      ✅ NEW
│   │   └── precautionaryService.ts     ✅ NEW
│   └── apiClient.ts                    ✅ EXISTS
```

### Backend (New Files)
```
app/
└── modules/
    └── admin_workflow/
        ├── __init__.py                 ✅ NEW
        ├── models.py                   ✅ NEW
        ├── schemas.py                  ✅ NEW
        ├── services.py                 ✅ NEW
        ├── routes.py                   ✅ NEW
        └── agent_client.py             ✅ NEW
```

---

## 🧪 Testing Commands

### Create Admin Account (cURL)
```bash
curl -X POST http://localhost:8000/api/admin/auth/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@climasync.ai",
    "password": "SecurePass123!",
    "org_name": "NDMA Pakistan",
    "full_name": "John Doe"
  }'
```

### Simulate Alert from Data Collector Agent
```bash
curl -X POST http://localhost:8000/api/admin/threshold-alerts \
  -H "Authorization: Bearer climasync-agent-secure-key-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "sensor_type": "rainfall",
    "location": {
      "latitude": 24.8607,
      "longitude": 67.0011,
      "location_name": "Karachi",
      "province": "Sindh"
    },
    "current_value": 150.5,
    "threshold_value": 100.0,
    "breach_percentage": 50.5,
    "severity": "HIGH",
    "data_source": "PMD Weather Station KHI-001"
  }'
```

### Get Alerts (with auth token)
```bash
curl -X GET http://localhost:8000/api/admin/threshold-alerts \
  -H "Authorization: Bearer <your_access_token>"
```

---

## 🔄 Workflow Steps

1. **Data Collector Agent** → Sends threshold breach alert to Backend
2. **Backend** → Stores alert in database
3. **Admin** → Views alert in frontend dashboard
4. **Admin** → Clicks "Analyze Risk" button
5. **Frontend** → Sends request to Backend
6. **Backend** → Forwards request to Risk Analysis Agent
7. **Risk Analysis Agent** → Analyzes and returns result
8. **Backend** → Stores result and returns to Frontend
9. **Frontend** → Displays risk analysis modal
10. **Admin** → Clicks "Generate Precautions" button
11. **Frontend** → Sends request to Backend
12. **Backend** → Forwards request to Precautionary Agent
13. **Precautionary Agent** → Generates measures and returns result
14. **Backend** → Stores result and returns to Frontend
15. **Frontend** → Displays precautionary measures modal
16. **Admin** → Reviews and approves measures

---

## 🗄️ Database Tables

### admin_users
- user_id (UUID, PK)
- email (VARCHAR, UNIQUE)
- password_hash (VARCHAR)
- full_name (VARCHAR)
- org_name (VARCHAR)
- role (VARCHAR)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)

### threshold_breach_alerts
- alert_id (UUID, PK)
- sensor_type (VARCHAR)
- latitude, longitude (NUMERIC)
- location_name, province (VARCHAR)
- current_value, threshold_value (NUMERIC)
- breach_percentage (NUMERIC)
- severity (VARCHAR)
- data_source (VARCHAR)
- status (VARCHAR)
- acknowledged_by (UUID, FK)
- acknowledged_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)

### risk_analyses
- analysis_id (UUID, PK)
- alert_id (UUID, FK)
- risk_score (INTEGER)
- risk_level (VARCHAR)
- disaster_type (VARCHAR)
- affected_area_km2 (NUMERIC)
- estimated_population_affected (INTEGER)
- confidence_score (INTEGER)
- analysis_summary (TEXT)
- detailed_analysis (JSONB)
- recommended_actions (JSONB)
- status (VARCHAR)
- requested_by (UUID, FK)
- requested_at, completed_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)

### precautionary_measures
- precaution_id (UUID, PK)
- analysis_id (UUID, FK)
- disaster_type (VARCHAR)
- risk_level (VARCHAR)
- overall_strategy (TEXT)
- measures (JSONB)
- timeline (JSONB)
- estimated_cost (NUMERIC)
- status (VARCHAR)
- requested_by, approved_by (UUID, FK)
- requested_at, generated_at, approved_at (TIMESTAMP)
- created_at, updated_at (TIMESTAMP)

---

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F
```

### Database Connection Error
```bash
# Check PostgreSQL
pg_isready

# Create database
createdb climasync_db

# Run migrations
alembic upgrade head
```

### CORS Error
Add to backend `main.py`:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Agent Not Responding
```bash
# Test agent endpoints
curl http://localhost:8002/docs
curl http://localhost:8003/docs
```

---

## 📚 Documentation Files

1. **BACKEND_API_IMPLEMENTATION.md** - Complete API specification
2. **BACKEND_IMPLEMENTATION_CODE.md** - Models, schemas, agent client
3. **BACKEND_SERVICES_ROUTES.md** - Services and routes implementation
4. **DEPLOYMENT_TESTING_GUIDE.md** - Setup and testing instructions
5. **QUICK_REFERENCE.md** - This file

---

## 🎯 Implementation Checklist

### Frontend ✅
- [x] Admin account creation page
- [x] Admin authentication service
- [x] Threshold alert service
- [x] Risk analysis service
- [x] Precautionary measures service
- [x] Threshold alerts page with complete workflow UI

### Backend (To Implement)
- [ ] Create admin_workflow module
- [ ] Implement models.py
- [ ] Implement schemas.py
- [ ] Implement services.py
- [ ] Implement routes.py
- [ ] Implement agent_client.py
- [ ] Register routes in main.py
- [ ] Create database migration
- [ ] Run migrations
- [ ] Test all endpoints

### Agents (To Implement)
- [ ] Add /api/analyze endpoint to Risk Analysis Agent
- [ ] Add /api/generate-measures endpoint to Precautionary Agent
- [ ] Test agent endpoints
- [ ] Configure agent URLs in backend

### Testing
- [ ] Test admin account creation
- [ ] Test alert creation from agent
- [ ] Test complete workflow end-to-end
- [ ] Test with real database
- [ ] Test error handling
- [ ] Test authentication and authorization

---

## 🚀 Next Actions

1. Copy backend code from documentation files to actual backend repository
2. Create database migration script
3. Run migrations to create tables
4. Implement agent endpoints
5. Test complete workflow
6. Deploy to staging
7. Conduct end-to-end testing
8. Deploy to production

---

**Status:** Frontend implementation complete ✅  
**Next:** Backend implementation in progress ⏳
