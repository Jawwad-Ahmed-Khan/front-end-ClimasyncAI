import asyncio
import websockets
import json
import urllib.request
import urllib.parse

def login_and_get_token():
    url = "http://localhost:8000/login"
    data = json.dumps({
        "email": "climasync.ai@gmail.com",
        "password": "Pass@1234"
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("Login successful.")
            return result.get("access_token")
    except urllib.error.HTTPError as e:
        print(f"Login failed: {e.code} - {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

async def test_websocket_broadcast(token):
    uri = f"ws://localhost:8000/ws/alerts?token={token}"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected successfully! The backend accepted the Admin token.")
            print("Waiting for messages... (Press Ctrl+C to stop)")
            
            # Keep connection open for a short time to prove it works
            try:
                await asyncio.wait_for(websocket.recv(), timeout=5.0)
            except asyncio.TimeoutError:
                print("Connection held successfully. No immediate messages received (which is expected unless an alert is fired right now).")
                
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    print("Attempting to authenticate...")
    token = login_and_get_token()
    if token:
        try:
            asyncio.run(test_websocket_broadcast(token))
        except KeyboardInterrupt:
            print("\nTest stopped.")