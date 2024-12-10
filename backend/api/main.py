# /Users/anand/Desktop/cerebro/backend/api/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
import os, sys

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from systemdb.db import init_db, get_user, get_all_users, get_all_roles, add_user, add_role
from middleware.error_handler import ErrorHandler
from utils.logger import logger

# Initialize database
logger.info("Initializing database...")
init_db()

# Initialize FastAPI app
app = FastAPI(title="Cerebro API", version="1.0.0")

# Add middleware
app.add_middleware(ErrorHandler)  # Add error handling middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming {request.method} request to {request.url.path}")
    response = await call_next(request)
    logger.info(f"Completed {request.method} request to {request.url.path} with status {response.status_code}")
    return response

# Existing endpoints
@app.post("/api/onboard")
async def onboard_user(request: Request):
    data = await request.json()
    user = get_user(data["email"])
    if user and user[2] == data["email"] and user[3] == data["code"]:
        return JSONResponse({"status": "ok"})
    return JSONResponse({"status": "error"}, status_code=400)

@app.post("/api/enterprise-config")
async def enterprise_config(request: Request):
    # Just return success for now
    return JSONResponse({"status": "ok"})

@app.post("/api/datasource-config")
async def datasource_config(request: Request):
    # Just return success message
    return JSONResponse({"status": "ok"})

@app.post("/api/datasource-config/add")
async def add_datasource_config(request: Request):
    # For now, just return success without storing anything
    return JSONResponse({"status": "ok", "message": "Datasource configured successfully"})

# Roles & Permissions Endpoints
# For simplicity, we hardcode the datasources from previous step
datasourceCategories = [
    {
      "category": "Relational Databases (RDBMS)",
      "types": ["SQL Server", "Oracle Database", "MySQL", "PostgreSQL"]
    },
    {
      "category": "NoSQL Databases",
      "types": ["MongoDB", "Cassandra"]
    },
    {
      "category": "Object Storage (Cloud Storage)",
      "types": ["Amazon S3", "Google Cloud Storage", "Azure Blob Storage"]
    },
    {
      "category": "Data Warehouses",
      "types": ["Snowflake", "Amazon Redshift", "Google BigQuery"]
    },
    {
      "category": "File Storage / Collaboration Platforms",
      "types": ["Google Drive", "Dropbox", "Microsoft OneDrive", "Box"]
    },
    {
      "category": "Data Lakes",
      "types": ["HDFS", "Azure Data Lake", "Amazon Lake Formation"]
    },
    {
      "category": "Communication Platforms",
      "types": ["Email", "Slack", "Microsoft Teams"]
    },
    {
      "category": "Project Management Tools",
      "types": ["Jira", "Asana", "Trello"]
    }
]

@app.get("/api/roles-permissions/users")
async def rp_users():
    users = get_all_users()
    return JSONResponse({"users": users})

@app.get("/api/roles-permissions/roles")
async def rp_roles():
    roles = get_all_roles()
    return JSONResponse({"roles": roles})

@app.get("/api/roles-permissions/datasources")
async def rp_datasources():
    return JSONResponse({"datasourceCategories": datasourceCategories})

@app.post("/api/roles-permissions/invite")
async def rp_invite(request: Request):
    data = await request.json()
    name = data.get("name", "")
    email = data["email"]
    role = data["role"]
    add_user(name, email, role)
    users = get_all_users()
    return JSONResponse({"users": users})

@app.post("/api/roles-permissions/create-role")
async def rp_create_role(request: Request):
    data = await request.json()
    role_name = data["role_name"]
    permissions = data["permissions"] # {ds: 'R'/'W'}
    add_role(role_name, permissions)
    roles = get_all_roles()
    return JSONResponse({"roles": roles})