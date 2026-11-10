"""
Resolve AI Seed Dataset
Contains canonical troubleshooting fixes with structured metadata and step-by-step procedures.
Each fix contains:
- id: unique string slug (e.g. 'db2-30082')
- tech: technology domain (Db2, Docker, Python, Node.js, Git, Networking, Security)
- code: exact error code / signature (SQL30082N, EADDRINUSE, etc.)
- etype: error classification (Authentication Failure, Service Availability, etc.)
- title: clear summary of the resolution pathway
- text: rich searchable text for semantic cosine matching
- steps: ordered list of actionable command steps
- source: origin tag (defaults to AI_ESTIMATE)
"""

FIXES = [
    {
        "id": "db2-30082",
        "tech": "Db2",
        "code": "SQL30082N",
        "etype": "Authentication Failure",
        "title": "Verify DB2COMM, db2inst1 user credentials, and TCPIP listener port 50000",
        "text": "SQL30082N Security processing failed with reason AUTHENTICATION db2 login failed authentication failed invalid db2 credentials db2inst1 password TCPIP port 50000",
        "steps": [
            "1. Enter the Db2 server container or host shell: `docker exec -it db2_database su - db2inst1`",
            "2. Confirm TCPIP communication protocol is enabled: `db2set DB2COMM=TCPIP`",
            "3. Verify database manager configuration for service name: `db2 get dbm cfg | grep -i svcename`",
            "4. Verify listener port matches standard 50000 (or 50001 for SSL): `netstat -tlpn | grep 50000`",
            "5. Update instance user password if corrupted: `passwd db2inst1`",
            "6. Force restart the instance to apply updates: `db2stop force && db2start`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "db2-auth-restart",
        "tech": "Db2",
        "code": "SQL30082N",
        "etype": "Authentication Failure",
        "title": "Force-restart Db2 instance and refresh authority catalog",
        "text": "db2 instance authentication timeout SQL30082N security failed db2stop force db2start connection refused",
        "steps": [
            "1. Switch to instance owner: `su - db2inst1`",
            "2. Terminate hung applications: `db2 force application all`",
            "3. Recycle the database manager instance: `db2stop force && db2start`",
            "4. Activate database: `db2 activate db TESTDB`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "db2-port-listener",
        "tech": "Db2",
        "code": "SQL30081N",
        "etype": "Communication Error",
        "title": "Configure TCPIP svcename and verify port 50000/50001 listener",
        "text": "SQL30081N Communication error detected on TCP/IP socket connection refused port 50000 remote host unreachable",
        "steps": [
            "1. Check /etc/services for db2c_db2inst1 port mapping: `grep db2 /etc/services`",
            "2. Set database manager configuration: `db2 update dbm cfg using SVCENAME 50000`",
            "3. Restart Db2 instance: `db2stop force && db2start`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "docker-engine-001",
        "tech": "Docker",
        "code": "DOCKER_SERVICE_SOCKET",
        "etype": "Service Availability",
        "title": "Start Docker engine service and verify unix socket permissions",
        "text": "Cannot connect to the Docker service at unix:///var/run/docker.sock docker service stopped docker engine not running unavailable engine dead",
        "steps": [
            "1. Check Docker systemd service status: `sudo systemctl status docker`",
            "2. Start or restart engine service: `sudo systemctl restart docker`",
            "3. On macOS / Windows, restart Docker Desktop application from the menu bar.",
            "4. Verify socket ownership and read/write permissions: `ls -la /var/run/docker.sock`",
            "5. Test connectivity: `docker ps`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "docker-socket-perms",
        "tech": "Docker",
        "code": "DOCKER_SERVICE_SOCKET",
        "etype": "Service Availability",
        "title": "Add user to docker group and restart systemd unit",
        "text": "permission denied while trying to connect to the Docker socket /var/run/docker.sock docker group usermod",
        "steps": [
            "1. Add current user to the docker group: `sudo usermod -aG docker $USER`",
            "2. Apply group permissions without logout: `newgrp docker`",
            "3. Confirm non-root execution: `docker run --rm hello-world`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "py-requests-001",
        "tech": "Python",
        "code": "ModuleNotFoundError",
        "etype": "Missing Dependency",
        "title": "Install requests package in current active environment via pip",
        "text": "ModuleNotFoundError: No module named 'requests' python pip import requests missing no module named requests",
        "steps": [
            "1. Verify active python interpreter binary: `which python` or `which python3`",
            "2. Install requests into current active environment: `pip install requests`",
            "3. Verify installation: `python3 -c \"import requests; print(requests.__version__)\"`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "py-requests-venv",
        "tech": "Python",
        "code": "ModuleNotFoundError",
        "etype": "Missing Dependency",
        "title": "Recreate Python virtual environment and activate correctly",
        "text": "python virtualenv venv corrupted ModuleNotFoundError pip broken activate environment",
        "steps": [
            "1. Deactivate existing broken environment: `deactivate` || true",
            "2. Remove old environment directory: `rm -rf .venv`",
            "3. Create fresh virtual environment: `python3 -m venv .venv`",
            "4. Activate and install requirements: `source .venv/bin/activate && pip install -r requirements.txt`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "node-port-3000",
        "tech": "Node.js",
        "code": "EADDRINUSE",
        "etype": "Port Conflict",
        "title": "Identify process on port 3000 using lsof and terminate cleanly",
        "text": "Error: listen EADDRINUSE: address already in use :::3000 port 3000 already in use express server listen fail",
        "steps": [
            "1. Find process holding port 3000: `lsof -i :3000`",
            "2. Note the lingering PID from output.",
            "3. Gracefully terminate process: `kill -15 <PID>` (or `kill -9 <PID>` if unresponsive).",
            "4. Restart Node/Vite server: `npm run dev`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "node-kill-port",
        "tech": "Node.js",
        "code": "EADDRINUSE",
        "etype": "Port Conflict",
        "title": "Use npx kill-port to free occupied socket or change PORT in env",
        "text": "eaddrinuse kill-port npx kill-port port conflict vite express",
        "steps": [
            "1. Run kill-port utility: `npx kill-port 3000`",
            "2. Alternatively set alternative port inline: `PORT=3001 npm run dev`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "npm-resolve-deps",
        "tech": "Node.js",
        "code": "ERESOLVE",
        "etype": "Dependency Tree Mismatch",
        "title": "Resolve peer dependency tree mismatch with legacy-peer-deps flag",
        "text": "npm ERR! code ERESOLVE unable to resolve dependency tree peerDependencies conflict npm install",
        "steps": [
            "1. Run installation bypassing strict peer dependency validation: `npm install --legacy-peer-deps`",
            "2. Alternatively clean lockfile and node_modules: `rm -rf node_modules package-lock.json && npm install`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "git-merge-abort",
        "tech": "Git",
        "code": "GIT_CONFLICT",
        "etype": "Version Control Conflict",
        "title": "Inspect conflicted files, accept incoming changes, or abort merge",
        "text": "Automatic merge failed; fix conflicts and then commit the result git merge conflict rebase",
        "steps": [
            "1. View conflicting files: `git status`",
            "2. To abort merge cleanly: `git merge --abort`",
            "3. Or resolve conflicts manually and commit: `git add . && git commit -m \"fix: resolve merge conflicts\"`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "cors-header-middleware",
        "tech": "Networking",
        "code": "CORS_POLICY",
        "etype": "Cross-Origin Policy",
        "title": "Add Access-Control-Allow-Origin headers in server middleware",
        "text": "CORS error: No 'Access-Control-Allow-Origin' header is present on the requested resource cross-origin preflight blocked",
        "steps": [
            "1. In Express.js, install and mount cors middleware: `app.use(cors({ origin: '*' }))`",
            "2. In FastAPI, add CORSMiddleware with allowed origins: `allow_origins=['*']`",
            "3. Verify browser network tab handles preflight OPTIONS request with HTTP 200/204."
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "ssh-key-perms",
        "tech": "Security",
        "code": "SSH_PUBLICKEY",
        "etype": "Access Control",
        "title": "Fix ~/.ssh/id_rsa permissions to 600 and register public key",
        "text": "Permission denied (publickey) ssh id_rsa permissions too open key rejected",
        "steps": [
            "1. Set private key permission: `chmod 600 ~/.ssh/id_rsa`",
            "2. Set ssh folder permissions: `chmod 700 ~/.ssh`",
            "3. Add key to SSH agent: `ssh-add ~/.ssh/id_rsa`",
            "4. Copy public key to remote host: `ssh-copy-id -i ~/.ssh/id_rsa.pub user@host`"
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "py-key-error-env",
        "tech": "Python",
        "code": "KeyError",
        "etype": "Environment Configuration",
        "title": "Use os.environ.get with fallback defaults or load .env via python-dotenv",
        "text": "KeyError: 'DB2_PASSWORD' missing in os.environ environment variable unset KeyError python",
        "steps": [
            "1. Use safe dictionary lookup with default fallback: `os.environ.get('DB2_PASSWORD', 'default_val')`",
            "2. Ensure dotenv is loaded before reading variables: `from dotenv import load_dotenv; load_dotenv()`",
            "3. Confirm `.env` exists in working directory with required keys."
        ],
        "source": "AI_ESTIMATE"
    },
    {
        "id": "flask-bind-host",
        "tech": "Networking",
        "code": "FLASK_PORT",
        "etype": "Port Conflict / Socket Binding",
        "title": "Bind Flask server to host 0.0.0.0 and alternate port",
        "text": "Invalid Flask Port / Host binding loopback container unreachable app.run port 5000",
        "steps": [
            "1. Configure Flask to listen on all interfaces: `app.run(host='0.0.0.0', port=5000)`",
            "2. If port 5000 conflicts with AirPlay or Docker, switch to alternate: `app.run(host='0.0.0.0', port=5001)`",
            "3. In Docker, ensure port is mapped in docker-compose.yml: `ports: ['5000:5000']`"
        ],
        "source": "AI_ESTIMATE"
    }
]
