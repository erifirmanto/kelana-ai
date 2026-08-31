# import trip_service
from services.trip_service import (
    get_trip_category,
    get_travel_season,
    calculate_daily_budget,
    recommended_places,
    get_transport_recommendation
)
from models.trip import Trip
from models.user import User
from database import SessionLocal
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.bedrock_service import get_ai_recommendation
from services.auth_service import register, login, SECRET_KEY, ALGORITHM
from dotenv import load_dotenv
from jose import jwt

import os 

load_dotenv()

app = FastAPI()

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = int(payload["sub"])

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    db = SessionLocal()

    user = db.query(User).filter(User.id == user_id).first()

    db.close()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user

app.add_middleware(
    CORSMiddleware,
    allow_origins = [os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

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

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/api/v1/auth/register")
def register_user(request: RegisterRequest):

    user = register(
        name=request.name,
        email=request.email,
        password=request.password
    )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email
    }

@app.post("/api/v1/auth/login")
def login_user(request: LoginRequest):
    token = login(
        email=request.email,
        password=request.password
    )

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# POST endpoint - receives JSON, returns JSON 
@app.post("/api/v1/trips")
def create_trip(request: TripRequest, current_user: User = Depends(get_current_user)):
    daily_budget = calculate_daily_budget(
        request.budget, request.days
    )
    category = get_trip_category(
        request.budget
    )
    transport = get_transport_recommendation(
        category
    )

    ai_recommendation = get_ai_recommendation(
        destination = request.destination,
        days = request.days,
        budget = request.budget,
        travel_style = request.travel_style
    )
    
    # create a Trip ORM object
    trip = Trip(
        destination = request.destination,
        days = request.days,
        budget = request.budget,
        category = category,
        travel_style=request.travel_style,
        user_id=current_user.id,
        daily_budget = daily_budget,
        ai_recommendation = ai_recommendation
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
def list_trips(current_user: User = Depends(get_current_user)):
    db = SessionLocal()

    trips = (
        db.query(Trip)
        .filter(Trip.user_id == current_user.id)
        .order_by(Trip.created_at.desc())
        .all()
    )

    db.close()

    return trips

@app.get("/api/v1/trips/{trip_id}")
def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = (
        db.query(Trip)
        .filter(
            Trip.id == trip_id,
            Trip.user_id == current_user.id
        )
        .first()
    )

    db.close()

    if trip is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    return trip

@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripUpdate,
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    if trip.user_id != current_user.id:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update this trip"
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
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user)
):
    db = SessionLocal()

    trip = db.query(Trip).filter(Trip.id == trip_id).first()

    if trip is None:
        db.close()
        raise HTTPException(
            status_code=404,
            detail=f"Trip with id {trip_id} not found"
        )

    if trip.user_id != current_user.id:
        db.close()
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this trip"
        )

    db.delete(trip)
    db.commit()
    db.close()

    return {
        "message": f"Trip with id {trip_id} deleted successfully"
    }