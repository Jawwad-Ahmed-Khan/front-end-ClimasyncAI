import asyncio
import websockets
import json

async def test_websocket_broadcast():
    uri = "ws://localhost:8000/ws/alerts?token=test_admin_token"
    print(f"Connecting to {uri}...")
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected successfully!")
            print("Waiting for messages... (Press Ctrl+C to stop)")
            
            while True:
                message = await websocket.recv()
                print("\n=== Received Message ===")
                try:
                    data = json.loads(message)
                    print(json.dumps(data, indent=2))
                except json.JSONDecodeError:
                    print(message)
                
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    try:
        asyncio.run(test_websocket_broadcast())
    except KeyboardInterrupt:
        print("\nTest stopped.")