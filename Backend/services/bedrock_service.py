import os
import json
import boto3
from dotenv import load_dotenv

load_dotenv()


def get_bedrock_client():
    """Configure and return an AWS Bedrock Runtime client using env credentials."""
    bearer_token = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
    region = os.getenv("AWS_REGION", "ap-southeast-2")

    if not bearer_token:
        raise ValueError("AWS_BEARER_TOKEN_BEDROCK is not set in the .env file.")

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=region,
        aws_access_key_id="bedrock-token",       # placeholder required by boto3
        aws_secret_access_key=bearer_token,       # bearer token passed as secret key
    )
    return client


def get_ai_recommendation(destination: str, days: int, budget: float, travel_style: str) -> str:
    """
    Call AWS Bedrock to generate a travel itinerary.

    Args:
        destination:   Travel destination (e.g. "Japan")
        days:          Number of days for the trip
        budget:        Total budget in USD
        travel_style:  Style of travel (e.g. "Family", "Solo", "Adventure")

    Returns:
        The AI-generated itinerary as a string.
    """
    client = get_bedrock_client()
    model_id = os.getenv("MODEL-ID", "amazon.nova-lite-v1:0")

    prompt = (
        f"You are an experienced travel planner. "
        f"Plan a {days}-day itinerary for {destination}. "
        f"Budget: USD {budget} "
        f"Travel Style: {travel_style}"
        f"For each day, provide a structured daily plan with: "
        f"2-3 specific morning activities, "
        f"afternoon activities including cultural sites and local experiences, "
        f"and evening activities including dinner spots and nightlife. "
        f"Make the recommendations practical, specific, and suitable for the travel style."
    )

    # Nova models use the Converse API payload format
    request_body = {
        "messages": [
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ]
    }

    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(request_body),
        contentType="application/json",
        accept="application/json",
    )

    response_body = json.loads(response["body"].read())

    # Extract text from Nova response structure
    recommendation = response_body["output"]["message"]["content"][0]["text"]
    return recommendation

def generate_chat_response(messages: list[dict]) -> str:
    """
    Generate an AI response using the conversation history.
    """

    client = get_bedrock_client()
    model_id = os.getenv("MODEL-ID", "amazon.nova-lite-v1:0")

    request_body = {
        "messages": messages
    }

    response = client.invoke_model(
        modelId=model_id,
        body=json.dumps(request_body),
        contentType="application/json",
        accept="application/json",
    )

    response_body = json.loads(response["body"].read())

    return response_body["output"]["message"]["content"][0]["text"]