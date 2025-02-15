import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CALENDAR_ACCESS_TOKEN = os.getenv("GOOGLE_CALENDAR_ACCESS_TOKEN")
FLIGHT_API_KEY = os.getenv("FLIGHT_API_KEY")
