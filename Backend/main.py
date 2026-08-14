# import trip_service
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    recommended_places
)

# input data
destination = input("Destination : ")
country = input("Country : ")
days = int(input("Days : "))
budget = float(input("Budget : "))
currency = input("Currency : ")
travel_month = input("Travel Month : ")

# function
def print_trip_summary(destination, country, days, budget, currency, travel_month):
    print("======================")
    print("KelanaAI")
    print("======================")
    print(f"Destination : {destination}")
    print(f"Country : {country}")
    print(f"Days : {days}")
    print(f"Budget : {budget}")
    print(f"Currency : {currency}")
    print(f"Travel Month : {travel_month}")

# call function
print_trip_summary(destination, country, days, budget, currency, travel_month)

print(f"\nCategory : {get_trip_category(budget)}")
print(f"Season : {get_travel_season(travel_month)}")
print(f"Daily Budget : {calculate_daily_budget(budget, days)} \n")

print("Recommended Places:")
for place in recommended_places:
    print(f"- {place}")



