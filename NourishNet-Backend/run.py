#!/usr/bin/env python3
"""
NourishNet Backend Startup Script
Run this script to start the Flask development server
"""

import os
import sys
from app import create_app

def main():
    """Main function to start the Flask application"""
    print("🚀 Starting NourishNet Backend API...")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    # Get configuration
    host = os.getenv('FLASK_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV', 'development') == 'development'
    
    print(f"🌐 Server will run on: http://{host}:{port}")
    print(f"🔧 Debug mode: {'ON' if debug else 'OFF'}")
    print(f"🗄️  Database: MongoDB Atlas")
    print("=" * 50)
    print("📚 API Documentation: http://localhost:5000/api/v1/health")
    print("🔗 Frontend URL: http://localhost:19006 (Expo)")
    print("=" * 50)
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Run the Flask app
        app.run(
            host=host,
            port=port,
            debug=debug,
            threaded=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
