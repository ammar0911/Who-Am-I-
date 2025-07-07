import network
import time
import random
from machine import Pin
import time
import urequests
import ujson
import ntptime


# my phones hotspot password
ssid = 'Hotspot'     
password = '11223344'

wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(ssid, password)

t = time.localtime()
current_hour = t[3]


if current_hour >= 19:
    sleep_duration_ms = 12 * 60 * 60 * 1000
    machine.deepsleep(sleep_duration_ms)

else:

    print("Connecting to WiFi...", end="")
    for i in range(10):
        if wlan.isconnected():
            break
        print(".", end="")
        time.sleep(1)

    if wlan.isconnected():
        print("\n✅ Connected!")
        print("IP address:", wlan.ifconfig()[0])
    else:
        print("\n❌ Could not connect.")

    url = "https://ubi-sys-lab-no-knock.vercel.app/api/sensors/jtXtrYmcN8D0zLpjKzWI"

    headers = {
        "Content-Type": "application/json",
        "message": "sensor data sent succesfully"
    }

    reed_pin = Pin(27, Pin.IN, Pin.PULL_UP)

    while True:
        try:
            if reed_pin.value() == 0:
                print("🔒 Door is CLOSED")
            else:
                print("🚪 Door is OPEN")
                
            data = {
                "id": "jtXtrYmcN8D0zLpjKzWI",
                "batteryStatus": random.randint(1,99),
                "inputTime": "2025-19-30T23:47:43.913Z",
                "isOpen": (reed_pin.value() != 0)
            }
            
            response = urequests.request(
                "POST",
                url,
                data=ujson.dumps(data),
                headers=headers
            )
            
            print(data)
            print("Status Code:", response.status_code)
            print("Response:", response.text)

            time.sleep(5)
        except Exception as e:
            print("Error sending request:", e)
            response.close()
        
    response.close()

