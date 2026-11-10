# IBM Db2 Fast Setup Guide

This guide covers setting up IBM Db2 for local development, Community Edition, and cloud deployment.

## 1. Local Container Deployment
Run IBM Db2 Community Edition using the official container image:
```bash
docker run -d --name db2server \
  --restart always \
  -p 50000:50000 -p 50001:50001 \
  --env-file .env \
  -e DBNAME=testdb \
  -e DB2INSTANCE=db2inst1 \
  -e DB2INST1_PASSWORD=SecurePassword123! \
  -e LICENSE=accept \
  icr.io/db2_community/db2:latest
```

## 2. Running Schema Migrations
Initialize the schema and create views:
```bash
python3 backend/seed.py
```
Or execute the SQL migration script directly:
```bash
db2 -tvf db/schema.sql
```

## 3. Verifying Connectivity
Verify TLS connectivity on port 50001:
```bash
curl -X GET https://your-backend.railway.app/api/health
```
Expected output:
```json
{
  "status": "online",
  "db2_connected": true,
  "vector_store": "DB2VS",
  "total_solutions": 50
}
```
