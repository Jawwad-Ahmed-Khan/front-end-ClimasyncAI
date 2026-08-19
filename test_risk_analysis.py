import urllib.request
import urllib.parse
import json
import time

def login_and_get_token():
    url = "http://localhost:8000/api/v1/auth/login" # Assuming this is the correct login path
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
        # Fallback to the root login if auth/login fails
        if e.code == 404:
            url_fallback = "http://localhost:8000/login"
            req_fallback = urllib.request.Request(url_fallback, data=data, headers={'Content-Type': 'application/json'})
            try:
                with urllib.request.urlopen(req_fallback) as res:
                    res_data = json.loads(res.read().decode('utf-8'))
                    print("Login successful on fallback.")
                    return res_data.get("access_token")
            except Exception as e2:
                 print(f"Fallback login failed: {e2}")
        return None
    except Exception as e:
        print(f"Connection error: {e}")
        return None

def trigger_risk_analysis(token):
    url = "http://localhost:8000/api/v1/risk-analysis/assess"
    
    payload = {
        "breach_id": "a402242f-4568-4642-be8f-50bfb65340a7",
        "disaster_kind": "flood",
        "location_name": "Larkana",
        "district": "Larkana",
        "province": "sindh",
        "latitude": 27.5589,
        "longitude": 68.212,
        "observed_value": 5.0,
        "threshold_value": 4.0,
        "breach_severity": "warning",
        "metric_name": "water_level_meters",
        "observation_time": "2026-05-13T08:13:39.457Z",
        "source_api": "usgs",
        "is_forecast_breach": False,
        "forecast_horizon_h": None,
        "gauge_id": None,
        "usgs_event_id": None,
        "weather_location_id": None
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    })
    
    print("Triggering Risk Analysis... This may take up to 4 minutes.")
    start_time = time.time()
    try:
        # Increase timeout for urlopen to 5 minutes
        with urllib.request.urlopen(req, timeout=300) as response:
            result = json.loads(response.read().decode('utf-8'))
            elapsed = time.time() - start_time
            print(f"Risk Analysis Complete in {elapsed:.2f} seconds.")
            print("\n=== Response Payload ===")
            print(json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        print(f"Risk Analysis failed: {e.code} - {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error during request: {e}")

if __name__ == "__main__":
    print("Attempting to authenticate...")
    token = login_and_get_token()
    if token:
        trigger_risk_analysis(token)
    else:
        print("Could not obtain token. Check backend is running and credentials are correct.")