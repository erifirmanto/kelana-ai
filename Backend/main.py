# import trip_service
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    recommended_places,
    get_transport_recommendation
)
from models.trip import Trip
from database import SessionLocal
from fastapi import FastAPI, HTTPException

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

class TripUpdate(BaseModel):
    budget: float

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

    # create a Trip ORM object
    trip = Trip(
        destination = request.destination,
        days = request.days,
        budget = request.budget,
        category = category,
        daily_budget = daily_budget
    )

    # save to PostgreSQL
    db = SessionLocal()
    db.add(trip)
    db.commit()
    db.refresh(trip) # get the auto-generated id
    db.close()
    return trip

# get recommendations
@app.get("/api/v1/recommendations")
def get_recommendations():
    return recommended_places

# get transportations
@app.get("/api/v1/transportations")
def get_transportations():
    return ["Bus", "Train", "Flight"]

@app.get("/api/v1/trips")
def list_trips():
    db = SessionLocal()
    trips = db.query(Trip).all()
    db.close()
    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(trip_id: int):
    db = SessionLocal()
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip

@app.put("/api/v1/trips/{trip_id}")
def update_trip(trip_id: int, request: TripUpdate):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    trip.budget = request.budget
    trip.category = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(
        request.budget,
        trip.days
    )

    db.commit()
    db.refresh(trip)
    db.close()

    return trip

@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(trip_id: int):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "message": f"Trip with id {trip_id} deleted successfully"
    }
