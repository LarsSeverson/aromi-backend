import json
# import psycopg


def get_suggested_fragrances(event):
    db_data = event.fragrances

    print('Test', db_data)

    return {
        'stash': {
            'suggestedFragrances': db_data
        },
        'statusCode': 200,
        'body': json.dumps(db_data)
    }
