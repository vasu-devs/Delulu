import sys
import os
print(f"CWD: {os.getcwd()}")
print(f"Path: {sys.path}")

try:
    import app
    print("✅ Imported app package")
except ImportError as e:
    print(f"❌ Failed to import app: {e}")

try:
    import pymupdf4llm
    print("✅ Imported pymupdf4llm")
except ImportError as e:
    print(f"❌ Failed to import pymupdf4llm: {e}")
except Exception as e:
    print(f"❌ Error importing pymupdf4llm: {e}")
