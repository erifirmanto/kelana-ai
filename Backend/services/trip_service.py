# trip category function
def get_trip_category(budget):
    if budget < 1000:
        category = "Backpacker"
    elif budget <= 3000:
        category = "Standard"
    else:
        category = "Luxury"
    
    return category

# transportation recommendation function 
def get_transport_recommendation(category):
    if category == "Backpacker":
        return "Bus"
    elif category == "Standard":
        return "Train"
    else:
        return "Flight"

# travel season function 
def get_travel_season(month):
    if month == "December":
        season = "Peak Season"
    elif month == "June":
        season = "Holiday Season"
    else:
        season = "Regular Season"
    
    return season

# daily budget function 
def calculate_daily_budget(budget, days):
    return budget/days

# places recommendation
recommended_places = [
    "Tokyo Tower",
    "Shibuya",
    "Mount Fuji"
]
