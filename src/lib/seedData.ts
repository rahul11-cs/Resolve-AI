/**
 * FixRank Seed Dataset
 * Contains developer error signatures and multi-pathway solutions with OS metadata and community verification.
 * Minimum 4 to 5 high-quality actionable fixes per problem category.
 */

export interface SeedSolution {
  id: number;
  problemId: string;
  title: string;
  steps: string;
  communityWorked: number;
  communityFailed: number;
  userWorked: number;
  userFailed: number;
  source: "COMMUNITY" | "USER" | "AI_ESTIMATE";
  category: string;
  os: "all" | "linux" | "macos" | "windows";
}

export interface SeedProblem {
  problemId: string;
  category: "python" | "node" | "docker" | "git" | "db2" | "networking" | "typescript" | "react" | "security";
  title: string;
  canonicalCode?: string;
  aliases: string[];
  tags: string[];
  solutions: SeedSolution[];
}

export const SEED_PROBLEMS: SeedProblem[] = [
  {
    problemId: "ERR_DOCKER_SERVICE_004",
    category: "docker",
    title: "Cannot connect to the Docker service at unix:///var/run/docker.sock",
    canonicalCode: "DOCKER_SERVICE",
    aliases: [
      "docker service not running",
      "docker service stopped",
      "docker engine unavailable",
      "cannot connect to docker service",
      "docker engine not running",
      "is the docker service running",
      "docker sock permission denied",
      "cannot connect to docker socket",
      "docker socket connection refused",
      "dial unix /var/run/docker.sock connect connection refused"
    ],
    tags: ["docker", "service", "engine", "linux", "socket", "systemctl"],
    solutions: [
      {
        id: 10,
        problemId: "ERR_DOCKER_SERVICE_004",
        title: "Start Docker systemd service",
        steps: "1. systemctl status docker\n2. sudo systemctl start docker\n3. docker info",
        communityWorked: 23,
        communityFailed: 3,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "docker",
        os: "linux"
      },
      {
        id: 11,
        problemId: "ERR_DOCKER_SERVICE_004",
        title: "Add current user to docker group to fix socket permissions",
        steps: "1. sudo groupadd docker\n2. sudo usermod -aG docker $USER\n3. newgrp docker\n4. docker ps",
        communityWorked: 31,
        communityFailed: 3,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "docker",
        os: "linux"
      },
      {
        id: 12,
        problemId: "ERR_DOCKER_SERVICE_004",
        title: "Restart Docker Desktop application (macOS/Windows)",
        steps: "1. Quit Docker Desktop from the system tray or menu bar.\n2. Wait 10 seconds for background engine shutdown.\n3. Relaunch Docker Desktop and verify engine status: docker version",
        communityWorked: 15,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "docker",
        os: "macos"
      },
      {
        id: 25,
        problemId: "ERR_DOCKER_SERVICE_004",
        title: "Restart systemd socket activation for Docker",
        steps: "1. sudo systemctl stop docker.socket docker.service\n2. sudo rm -f /var/run/docker.sock\n3. sudo systemctl start docker.socket\n4. sudo systemctl start docker.service",
        communityWorked: 12,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "docker",
        os: "linux"
      },
      {
        id: 26,
        problemId: "ERR_DOCKER_SERVICE_004",
        title: "Unset stale DOCKER_HOST environment variable",
        steps: "1. Check current DOCKER_HOST: echo $DOCKER_HOST\n2. Unset remote/stale endpoint: unset DOCKER_HOST\n3. Verify direct socket access: docker info",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "docker",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_NODE_PORT_002",
    category: "networking",
    title: "Error: listen EADDRINUSE: address already in use :::3000",
    canonicalCode: "EADDRINUSE",
    aliases: [
      "port 3000 already in use",
      "address already in use",
      "eaddrinuse",
      "listen eaddrinuse 3000",
      "port conflict 3000",
      "node port already in use",
      "kill process on port 3000",
      "port 3000 in use",
      "eaddrinuse :::3000",
      "port is already allocated"
    ],
    tags: ["node", "express", "port", "eaddrinuse", "3000", "server", "socket"],
    solutions: [
      {
        id: 4,
        problemId: "ERR_NODE_PORT_002",
        title: "Identify PID using lsof and kill the lingering process",
        steps: "1. Find process holding port 3000: lsof -i :3000\n2. Note PID from output\n3. Terminate process gracefully: kill -15 <PID> (or kill -9 <PID> if stubborn)",
        communityWorked: 55,
        communityFailed: 3,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "macos"
      },
      {
        id: 5,
        problemId: "ERR_NODE_PORT_002",
        title: "One-liner port killer using npx kill-port",
        steps: "1. npx kill-port 3000\n2. npm run dev",
        communityWorked: 28,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 6,
        problemId: "ERR_NODE_PORT_002",
        title: "Kill port listener via Windows PowerShell NetTCPConnection",
        steps: "1. Get-NetTCPConnection -LocalPort 3000\n2. Stop-Process -Id <PID> -Force\n3. npm run dev",
        communityWorked: 18,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "windows"
      },
      {
        id: 27,
        problemId: "ERR_NODE_PORT_002",
        title: "Stop background Docker container binding port 3000",
        steps: "1. docker ps --filter \"publish=3000\"\n2. docker stop <CONTAINER_ID>\n3. docker rm <CONTAINER_ID>",
        communityWorked: 14,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 28,
        problemId: "ERR_NODE_PORT_002",
        title: "Configure alternate dev port in package.json or vite.config.ts",
        steps: "1. Launch with dynamic port: PORT=3001 npm run dev\n2. Or update vite.config.ts server: { port: 3001, strictPort: false }",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "networking",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_PY_REQ_001",
    category: "python",
    title: "ModuleNotFoundError: No module named 'requests'",
    canonicalCode: "ModuleNotFoundError",
    aliases: [
      "no module named requests",
      "modulenotfounderror requests",
      "modulenotfounderror",
      "python requests missing",
      "cannot import requests",
      "import requests failed",
      "pip install requests",
      "importerror no module named requests",
      "requests module not found"
    ],
    tags: ["python", "pip", "virtualenv", "import", "requests"],
    solutions: [
      {
        id: 1,
        problemId: "ERR_PY_REQ_001",
        title: "Install requests package in current active environment",
        steps: "1. Verify active python binary: which python\n2. Install package via pip: pip install requests\n3. Confirm installation: python -c 'import requests; print(requests.__version__)'",
        communityWorked: 42,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 2,
        problemId: "ERR_PY_REQ_001",
        title: "Explicitly invoke pip with python3 module flag",
        steps: "1. Determine interpreter path: python3 -c 'import sys; print(sys.executable)'\n2. Run module install: python3 -m pip install requests\n3. Execute script with matching interpreter: python3 main.py",
        communityWorked: 29,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 3,
        problemId: "ERR_PY_REQ_001",
        title: "Recreate corrupted Python virtual environment",
        steps: "1. deactivate\n2. rm -rf .venv\n3. python3 -m venv .venv\n4. source .venv/bin/activate && pip install -r requirements.txt",
        communityWorked: 16,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "linux"
      },
      {
        id: 29,
        problemId: "ERR_PY_REQ_001",
        title: "Install using Poetry or Pipenv dependency manager",
        steps: "1. If using Poetry: poetry add requests\n2. If using Pipenv: pipenv install requests\n3. Run script inside managed shell: poetry run python main.py",
        communityWorked: 11,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 30,
        problemId: "ERR_PY_REQ_001",
        title: "Verify PYTHONPATH and multi-version python environment",
        steps: "1. Check sys.path: python3 -c \"import sys; print('\\n'.join(sys.path))\"\n2. Ensure site-packages directory is on PYTHONPATH: export PYTHONPATH=$PYTHONPATH:. \n3. Re-execute python main.py",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "python",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_DB2_AUTH_006",
    category: "db2",
    title: "IBM Db2 SQL30082N Security processing failed / Connection authorization failure",
    canonicalCode: "SQL30082N",
    aliases: [
      "db2 login failed",
      "db2 authentication failed",
      "invalid db2 credentials",
      "sql30082n",
      "security processing failed",
      "invalid credentials",
      "db2 authorization failed",
      "sqlcode=-30082",
      "sqlstate=08001",
      "authentication failed for db2inst1",
      "db2 login error",
      "ibm db2 security processing failed",
      "connection authorization failure",
      "ibm_db login failed",
      "db2 connection failed"
    ],
    tags: ["db2", "ibm_db", "database", "sqlstate-08001", "sqlcode-30082", "security", "credentials"],
    solutions: [
      {
        id: 15,
        problemId: "ERR_DB2_AUTH_006",
        title: "Verify user credentials and instance container password",
        steps: "1. Confirm DB2USER matches instance user (typically db2inst1)\n2. Ensure Db2 instance has finished startup: docker logs db2\n3. Reset password inside instance: docker exec -it db2 bash -c 'echo \"db2inst1:new_password\" | chpasswd'",
        communityWorked: 38,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "db2",
        os: "all"
      },
      {
        id: 16,
        problemId: "ERR_DB2_AUTH_006",
        title: "Verify Db2 communication protocol and port configuration",
        steps: "1. Inside Db2 container: su - db2inst1 -c 'db2set DB2COMM=TCPIP'\n2. Check listener port: su - db2inst1 -c 'db2 get dbm cfg | grep -i svcename'\n3. Restart Db2 instance: su - db2inst1 -c 'db2stop force && db2start'",
        communityWorked: 24,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "db2",
        os: "linux"
      },
      {
        id: 31,
        problemId: "ERR_DB2_AUTH_006",
        title: "Verify SSL/TLS certificate and connection security mode",
        steps: "1. If connecting to IBM Cloud Db2, ensure SSL is specified: SECURITY=SSL\n2. Set SSLServerCertificate path in connection string: SSLServerCertificate=/path/to/cert.arm\n3. Verify port 50001 (SSL) vs port 50000 (Plaintext)",
        communityWorked: 19,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "db2",
        os: "all"
      },
      {
        id: 32,
        problemId: "ERR_DB2_AUTH_006",
        title: "Test connection string with ibm_db CLI diagnostic utility",
        steps: "1. python3 -c \"import ibm_db; conn = ibm_db.connect('DATABASE=testdb;HOSTNAME=db2.cloud;PORT=50001;PROTOCOL=TCPIP;UID=db2inst1;PWD=password;', '', ''); print('Connected!', conn)\"\n2. Review exact SQLCODE and SQLSTATE returned",
        communityWorked: 14,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "db2",
        os: "all"
      },
      {
        id: 33,
        problemId: "ERR_DB2_AUTH_006",
        title: "Refresh Db2 instance license and unlock service account",
        steps: "1. su - db2inst1 -c 'db2licm -l'\n2. Check pam / shadow lockout: pam_tally2 --user=db2inst1 --reset\n3. Re-test authentication from client application",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "db2",
        os: "linux"
      }
    ]
  },
  {
    problemId: "ERR_NPM_RESOLVE_003",
    category: "node",
    title: "npm ERR! code ERESOLVE unable to resolve dependency tree",
    canonicalCode: "ERESOLVE",
    aliases: [
      "npm dependency conflict",
      "unable to resolve dependency tree",
      "peer dependency conflict",
      "eresolve",
      "npm install failed dependency tree",
      "legacy peer deps",
      "code eresolve unable to resolve dependency tree"
    ],
    tags: ["npm", "dependencies", "peerDependencies", "node", "eresolve"],
    solutions: [
      {
        id: 7,
        problemId: "ERR_NPM_RESOLVE_003",
        title: "Install with --legacy-peer-deps flag",
        steps: "1. npm install --legacy-peer-deps\n2. npm run build",
        communityWorked: 68,
        communityFailed: 7,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "node",
        os: "all"
      },
      {
        id: 8,
        problemId: "ERR_NPM_RESOLVE_003",
        title: "Delete node_modules and package-lock.json and clean cache",
        steps: "1. rm -rf node_modules package-lock.json\n2. npm cache clean --force\n3. npm install",
        communityWorked: 32,
        communityFailed: 4,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "node",
        os: "linux"
      },
      {
        id: 9,
        problemId: "ERR_NPM_RESOLVE_003",
        title: "Use npm overrides in package.json to force compatible version",
        steps: "1. Add to package.json:\n\"overrides\": { \"conflicting-pkg\": \"^2.0.0\" }\n2. npm install",
        communityWorked: 26,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "node",
        os: "all"
      },
      {
        id: 34,
        problemId: "ERR_NPM_RESOLVE_003",
        title: "Use npm install --force override",
        steps: "1. npm install --force\n2. Verify bundle execution with npm test",
        communityWorked: 18,
        communityFailed: 3,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "node",
        os: "all"
      },
      {
        id: 35,
        problemId: "ERR_NPM_RESOLVE_003",
        title: "Upgrade Node.js runtime and npm CLI to latest LTS",
        steps: "1. nvm install 22\n2. nvm use 22\n3. npm install -g npm@latest\n4. npm install",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "node",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_CORS_ORIGIN_007",
    category: "networking",
    title: "CORS error: No 'Access-Control-Allow-Origin' header is present",
    canonicalCode: "CORS_ORIGIN",
    aliases: [
      "cors policy error",
      "access-control-allow-origin missing",
      "blocked by cors policy",
      "cross origin request blocked",
      "cors header missing",
      "no access-control-allow-origin header"
    ],
    tags: ["cors", "fetch", "express", "fastapi", "access-control-allow-origin"],
    solutions: [
      {
        id: 17,
        problemId: "ERR_CORS_ORIGIN_007",
        title: "Configure CORSMiddleware in FastAPI backend",
        steps: "1. from fastapi.middleware.cors import CORSMiddleware\n2. app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])\n3. Restart backend server",
        communityWorked: 52,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 18,
        problemId: "ERR_CORS_ORIGIN_007",
        title: "Configure VITE_API_URL environment variable for API endpoint routing",
        steps: "1. In .env.local set VITE_API_URL=https://resolve-ai-backend.railway.app\n2. Use client client fetch with import.meta.env.VITE_API_URL",
        communityWorked: 41,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 36,
        problemId: "ERR_CORS_ORIGIN_007",
        title: "Configure cors npm package in Express backend",
        steps: "1. npm install cors @types/cors\n2. import cors from 'cors';\n3. app.use(cors({ origin: true, credentials: true }));",
        communityWorked: 33,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 37,
        problemId: "ERR_CORS_ORIGIN_007",
        title: "Add Access-Control-Allow headers in Nginx reverse proxy",
        steps: "1. add_header 'Access-Control-Allow-Origin' '$http_origin' always;\n2. add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;\n3. sudo nginx -s reload",
        communityWorked: 21,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "linux"
      },
      {
        id: 38,
        problemId: "ERR_CORS_ORIGIN_007",
        title: "Handle HTTP OPTIONS preflight request explicitly",
        steps: "1. @app.options('/{rest_of_path:path}')\ndef preflight_handler():\n    return Response(status_code=204)",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "networking",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_SSH_KEY_008",
    category: "security",
    title: "Permission denied (publickey) when connecting via SSH",
    canonicalCode: "SSH_PUBLICKEY",
    aliases: [
      "permission denied publickey",
      "ssh permission denied",
      "git push permission denied publickey",
      "ssh key authentication failed",
      "ssh key rejected",
      "git@github.com permission denied publickey"
    ],
    tags: ["ssh", "git", "github", "publickey", "permission denied"],
    solutions: [
      {
        id: 19,
        problemId: "ERR_SSH_KEY_008",
        title: "Add SSH private key to ssh-agent",
        steps: "1. eval \"$(ssh-agent -s)\"\n2. ssh-add ~/.ssh/id_ed25519 (or ~/.ssh/id_rsa)\n3. ssh -T git@github.com",
        communityWorked: 63,
        communityFailed: 4,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "security",
        os: "all"
      },
      {
        id: 20,
        problemId: "ERR_SSH_KEY_008",
        title: "Fix directory and key file permissions",
        steps: "1. chmod 700 ~/.ssh\n2. chmod 600 ~/.ssh/id_ed25519\n3. chmod 644 ~/.ssh/id_ed25519.pub\n4. Re-test SSH connection",
        communityWorked: 29,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "security",
        os: "linux"
      },
      {
        id: 39,
        problemId: "ERR_SSH_KEY_008",
        title: "Generate fresh ED25519 SSH key and add to GitHub account",
        steps: "1. ssh-keygen -t ed25519 -C \"developer@example.com\"\n2. cat ~/.ssh/id_ed25519.pub\n3. Paste public key into GitHub Settings -> SSH and GPG keys",
        communityWorked: 25,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "security",
        os: "all"
      },
      {
        id: 40,
        problemId: "ERR_SSH_KEY_008",
        title: "Configure ~/.ssh/config host profile",
        steps: "1. Add to ~/.ssh/config:\nHost github.com\n  HostName github.com\n  User git\n  IdentityFile ~/.ssh/id_ed25519\n  IdentitiesOnly yes",
        communityWorked: 18,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "security",
        os: "all"
      },
      {
        id: 41,
        problemId: "ERR_SSH_KEY_008",
        title: "Fallback to HTTPS with GitHub Personal Access Token (PAT)",
        steps: "1. git remote set-url origin https://github.com/rahul11-cs/Resolve-AI-.git\n2. git push -u origin main",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "security",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_GIT_CONFLICT_005",
    category: "git",
    title: "Automatic merge failed; fix conflicts and then commit the result",
    canonicalCode: "GIT_MERGE_CONFLICT",
    aliases: [
      "git merge conflict",
      "automatic merge failed",
      "fix conflicts and then commit",
      "git pull conflict",
      "merge conflict in branch",
      "git conflict resolved"
    ],
    tags: ["git", "merge", "conflict", "rebase"],
    solutions: [
      {
        id: 13,
        problemId: "ERR_GIT_CONFLICT_005",
        title: "Resolve conflict markers manually and commit",
        steps: "1. git status\n2. Open conflicted files and select desired lines\n3. git add <filename>\n4. git commit -m 'Merge branch and resolve conflicts'",
        communityWorked: 49,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "git",
        os: "all"
      },
      {
        id: 14,
        problemId: "ERR_GIT_CONFLICT_005",
        title: "Abort current merge safely to reset working tree",
        steps: "1. git merge --abort\n2. git status",
        communityWorked: 27,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "git",
        os: "all"
      },
      {
        id: 42,
        problemId: "ERR_GIT_CONFLICT_005",
        title: "Use Git mergetool with Visual Studio Code",
        steps: "1. git config --global merge.tool vscode\n2. git mergetool\n3. Save and complete commit: git commit",
        communityWorked: 22,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "git",
        os: "all"
      },
      {
        id: 43,
        problemId: "ERR_GIT_CONFLICT_005",
        title: "Rebase on upstream main with step-by-step resolution",
        steps: "1. git fetch origin\n2. git rebase origin/main\n3. Resolve conflict in files\n4. git rebase --continue",
        communityWorked: 16,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "git",
        os: "all"
      },
      {
        id: 44,
        problemId: "ERR_GIT_CONFLICT_005",
        title: "Accept incoming branch version wholesale (theirs)",
        steps: "1. git checkout --theirs <filename>\n2. git add <filename>\n3. git commit -m 'Resolved conflict accepting incoming branch'",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "git",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_KEY_ERROR_009",
    category: "python",
    title: "KeyError: environment variable or dictionary key missing",
    canonicalCode: "KeyError",
    aliases: [
      "keyerror",
      "keyerror db2_password",
      "keyerror api_key",
      "missing environment variable in os.environ",
      "dictionary key missing",
      "os.environ key error",
      "keyerror in python",
      "missing env var keyerror"
    ],
    tags: ["python", "keyerror", "os.environ", "dictionary", "env"],
    solutions: [
      {
        id: 21,
        problemId: "ERR_KEY_ERROR_009",
        title: "Use os.environ.get() with fallback value",
        steps: "1. Replace direct indexing os.environ['KEY'] with os.environ.get('KEY', 'default_value')\n2. Or add check: val = os.environ.get('KEY'); if not val: raise ValueError('KEY must be set in .env')",
        communityWorked: 48,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 22,
        problemId: "ERR_KEY_ERROR_009",
        title: "Load .env file using python-dotenv before reading os.environ",
        steps: "1. pip install python-dotenv\n2. At top of entry file:\nfrom dotenv import load_dotenv\nload_dotenv()\n3. Verify .env file exists in root",
        communityWorked: 37,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 45,
        problemId: "ERR_KEY_ERROR_009",
        title: "Use dict.get() method with explicit default handling",
        steps: "1. Replace data['key'] with data.get('key', None)\n2. Add guard check: if 'key' in data:",
        communityWorked: 29,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 46,
        problemId: "ERR_KEY_ERROR_009",
        title: "Use collections.defaultdict to avoid KeyErrors in data pipelines",
        steps: "1. from collections import defaultdict\n2. counts = defaultdict(int)\n3. counts['unseen_key'] += 1",
        communityWorked: 18,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "python",
        os: "all"
      },
      {
        id: 47,
        problemId: "ERR_KEY_ERROR_009",
        title: "Validate required environment variables with Pydantic BaseSettings",
        steps: "1. from pydantic_settings import BaseSettings\nclass Settings(BaseSettings):\n    DB2_PASSWORD: str\n    class Config: env_file = '.env'",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "python",
        os: "all"
      }
    ]
  },
  {
    problemId: "ERR_FLASK_PORT_010",
    category: "networking",
    title: "Invalid Flask Port / Host binding: unreachable on loopback outside container",
    canonicalCode: "FLASK_PORT_BINDING",
    aliases: [
      "invalid flask port",
      "flask port binding",
      "flask loopback connection refused",
      "flask container binding issue",
      "flask run host 0.0.0.0",
      "flask port 5000 conflict",
      "cannot connect to flask server",
      "flask app.run port",
      "airplay port 5000 conflict"
    ],
    tags: ["flask", "python", "port", "0.0.0.0", "docker", "network", "5000"],
    solutions: [
      {
        id: 23,
        problemId: "ERR_FLASK_PORT_010",
        title: "Explicitly bind Flask host to 0.0.0.0 instead of default loopback",
        steps: "1. In Flask script: app.run(host='0.0.0.0', port=5000, debug=True)\n2. Or via CLI: flask run --host=0.0.0.0 --port=5000",
        communityWorked: 58,
        communityFailed: 3,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 24,
        problemId: "ERR_FLASK_PORT_010",
        title: "Switch port from 5000 to 5001 or 8000 to avoid macOS AirPlay conflict",
        steps: "1. Change Flask port: app.run(host='0.0.0.0', port=5001)\n2. Or disable AirPlay Receiver in macOS: System Settings -> AirDrop & Handoff -> AirPlay Receiver (Toggle Off)",
        communityWorked: 44,
        communityFailed: 2,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "macos"
      },
      {
        id: 48,
        problemId: "ERR_FLASK_PORT_010",
        title: "Publish container port in Docker run command",
        steps: "1. docker run -p 5000:5000 my-flask-app\n2. Verify mapping: docker port <container_id>",
        communityWorked: 28,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "all"
      },
      {
        id: 49,
        problemId: "ERR_FLASK_PORT_010",
        title: "Run production WSGI server with Gunicorn binding",
        steps: "1. pip install gunicorn\n2. gunicorn --bind 0.0.0.0:5000 app:app\n3. curl http://0.0.0.0:5000/health",
        communityWorked: 22,
        communityFailed: 1,
        userWorked: 0,
        userFailed: 0,
        source: "COMMUNITY",
        category: "networking",
        os: "linux"
      },
      {
        id: 50,
        problemId: "ERR_FLASK_PORT_010",
        title: "Check firewall and iptables port rules",
        steps: "1. sudo ufw allow 5000/tcp\n2. sudo ufw status",
        communityWorked: 0,
        communityFailed: 0,
        userWorked: 0,
        userFailed: 0,
        source: "AI_ESTIMATE",
        category: "networking",
        os: "linux"
      }
    ]
  }
];
