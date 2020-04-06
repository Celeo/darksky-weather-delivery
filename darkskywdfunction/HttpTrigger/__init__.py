from datetime import datetime
import json
from os import environ
from typing import Any, Dict, Union

from azure.functions import HttpRequest, HttpResponse
import httpx
import pytz


ENV_VAR_KEY_SECRET = 'DARK_SKY_SECRET_KEY'
ENV_VAR_KEY_LOCATION = 'DARK_SKY_LOCATION'
TZ_LA = pytz.timezone('America/Los_Angeles')


def round_n(n: Union[int, float]) -> int:
    return int(round(n))


def build_response_json(api_data: Dict[str, Any]) -> Dict[str, Any]:
    current_time = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(TZ_LA)
    current_day = current_time.strftime('%d')
    return_data: Dict[str, Any] = {
        'summary': {
            'current': api_data['currently']['summary'],
            'hourly': api_data['hourly']['summary'],
            'daily': api_data['daily']['summary']
        },
        'current': {
            'temperature': round_n(api_data['currently']['temperature']),
            'precipProbability': round_n(api_data['currently']['precipProbability'] * 100),
            'humidity': round_n(api_data['currently']['humidity'] * 100),
            'windSpeed': round_n(api_data['currently']['windSpeed']),
            'cloudCover': round_n(api_data['currently']['cloudCover'] * 100),
        }
    }
    hourly = []
    break_next = False
    for hour in api_data['hourly']['data']:
        if break_next:
            break
        dt = datetime.fromtimestamp(hour['time'], pytz.utc).astimezone(TZ_LA)
        if dt.strftime('%d') != current_day:
            break_next = True
        hourly.append({
            'time': dt.strftime('%I %p'),
            'summary': hour['summary'],
            'temperature': round_n(hour['temperature'])
        })
    return_data['hourly'] = hourly
    daily = []
    for day in api_data['daily']['data']:
        daily.append({
            'day': datetime.fromtimestamp(day['time'], pytz.utc).astimezone(TZ_LA).strftime('%a %m/%d'),
            'summary': day['summary'],
            'temperatureLow': round_n(day['temperatureLow']),
            'temperatureHigh': round_n(day['temperatureHigh']),
            'humidity': round_n(day['humidity'] * 100),
            'precipProbability': round_n(day['precipProbability'] * 100),
            'precipType': day['precipType']
        })
    return_data['daily'] = daily
    return return_data


def main(req: HttpRequest) -> HttpResponse:
    ds_secret_key = environ.get(ENV_VAR_KEY_SECRET)
    if not ds_secret_key:
        return HttpResponse('Could not load Dark Sky API secret', status_code=500)
    ds_location = environ.get(ENV_VAR_KEY_LOCATION)
    if not ds_location:
        return HttpResponse('Could not load location key', status_code=500)
    r = httpx.get(f'https://api.darksky.net/forecast/{ds_secret_key}/{ds_location}?exclude=minutely')
    if not r.status_code == 200:
        return HttpResponse(f'Got status code {r.status_code} from Dark Sky API', status_code=500)
    return HttpResponse(json.dumps(build_response_json(r.json())), mimetype='application/json')
