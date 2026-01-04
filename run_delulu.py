import os
import subprocess
import sys
import platform
import time
import signal

def run_command(command, cwd=None, shell=True):
    print(f"Executing: {command} in {cwd or 'current directory'}")
    return subprocess.run(command, cwd=cwd, shell=shell)

def kill_port(port):
    print(f"Cleaning port {port}...")
    try:
        if platform.system() == "Windows":
            # Windows port killing
            result = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode()
            pids = set([line.strip().split()[-1] for line in result.splitlines() if line.strip()])
            for pid in pids:
                if pid != "0":
                    subprocess.run(f"taskkill /F /PID {pid}", shell=True, capture_output=True)
        else:
            # Linux/Mac port killing
            subprocess.run(f"lsof -ti :{port} | xargs kill -9", shell=True, capture_output=True)
    except Exception:
        pass # Port probably already free

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    server_dir = os.path.join(root_dir, "server")
    client_dir = os.path.join(root_dir, "web")

    print("\n🍗 Starting Delulu Production Stack (Cross-Platform)...")

    # 1. Port Clearing
    kill_port(8000)
    kill_port(3000)

    # 2. Backend Setup
    print("\n🐍 Setting up Python Backend...")
    run_command(f"{sys.executable} -m pip install -r requirements.txt", cwd=server_dir)

    # 3. Frontend Setup
    print("\n⚛️ Setting up Next.js Frontend...")
    # Check if npm is available
    try:
        subprocess.run("npm --version", shell=True, capture_output=True, check=True)
        run_command("npm install", cwd=client_dir)
    except Exception:
        print("❌ Error: npm not found. Please install Node.js.")
        sys.exit(1)

    # 4. Starting Parallel Services
    processes = []
    
    print("\n🚀 Launching Services...")
    
    # Start Backend
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=server_dir
    )
    processes.append(backend_proc)
    
    # Start Frontend
    frontend_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=client_dir,
        shell=(platform.system() == "Windows")
    )
    processes.append(frontend_proc)

    print("\n✅ Services are starting!")
    print("Backend: http://127.0.0.1:8000")
    print("Frontend: http://localhost:3000")
    print("\nPress Ctrl+C to stop all services.")

    try:
        while True:
            time.sleep(1)
            # Check if processes are still running
            for p in processes:
                if p.poll() is not None:
                    print(f"\n⚠️ Process {p.args} stopped unexpectedly.")
                    sys.exit(1)
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
        for p in processes:
            if platform.system() == "Windows":
                subprocess.run(f"taskkill /F /T /PID {p.pid}", shell=True, capture_output=True)
            else:
                p.terminate()
        print("Done.")

if __name__ == "__main__":
    main()
