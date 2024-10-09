import json
# import psycopg


def get_suggested_fragrances(event, context):
    fragrances = event["fragrances"]

    return {
        "statusCode": 200,
        "suggestedFragrances": fragrances
    }
