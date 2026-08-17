# import trip_service
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    recommended_places,
    get_transport_recommendation
)

# # input data
# destination = input("Destination : ")
# country = input("Country : ")
# days = int(input("Days : "))
# budget = float(input("Budget : "))
# currency = input("Currency : ")
# travel_month = input("Travel Month : ")

# # function
# def print_trip_summary(destination, country, days, budget, currency, travel_month):
#     print("======================")
#     print("KelanaAI")
#     print("======================")
#     print(f"Destination : {destination}")
#     print(f"Country : {country}")
#     print(f"Days : {days}")
#     print(f"Budget : {budget}")
#     print(f"Currency : {currency}")
#     print(f"Travel Month : {travel_month}")

# # call function
# print_trip_summary(destination, country, days, budget, currency, travel_month)

# print(f"\nCategory : {get_trip_category(budget)}")
# print(f"Season : {get_travel_season(travel_month)}")
# print(f"Daily Budget : {calculate_daily_budget(budget, days)} \n")

# print("Recommended Places:")
# for place in recommended_places:
#     print(f"- {place}")

from fastapi import FastAPI

app = FastAPI()

# a GET endpoint at the root path
@app.get("/")
def home():
    return {
        "message" : "Welcome to KelanaAI"
    }

from pydantic import BaseModel

class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

# POST endpoint - receives JSON, returns JSON 
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):
    daily_budget = calculate_daily_budget(
        request.budget, request.days
    )
    category = get_trip_category(
        request.budget
    )
    transport = get_transport_recommendation(
        category
    )

    return {
        "destination" : request.destination,
        "budget" : request.budget,
        "daily_budget" : daily_budget,
        "category" : category,
        "recommendation_transport" : transport
    }

# get recommendations
@app.get("/api/v1/recommendations")
def get_recommendations():
    return recommended_places

# get transportations
@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]
