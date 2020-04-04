from datetime import datetime
import json
import sys

import httpx


def round_n(n):
    return int(round(n))


def format_t(t):
    if t[-1] == '.':
        t = t[:-1]
    if t[0].isupper():
        t = t[0].lower() + ''.join(t[1:])
    return t


def load_config():
    with open('local.settings.json') as f:
        config = json.load(f)
    secret_key = config['Values']['DARK_SKY_SECRET_KEY']
    location = config['Values']['DARK_SKY_LOCATION']
    return (secret_key, location)


def main():
    secret_key, location = load_config()
    r = httpx.get(f'https://api.darksky.net/forecast/{secret_key}/{location}?exclude=minutely')
    if not r.status_code == 200:
        print(f'Got status code {r.status_code} from Dark Sky API')
        sys.exit(1)
    data = r.json()
    current_day = datetime.now().strftime('%d')

    print('Current condition:', data['currently']['summary'])
    print('Hourly summary:', data['hourly']['summary'])
    print('Daily summary:', data['daily']['summary'])

    print()
    print('Hourly breakdown')
    print('----------------')
    for hour in data['hourly']['data']:
        dt = datetime.fromtimestamp(hour['time'])
        if dt.strftime('%d') != current_day:
            break
        print('At {}: {} and {}°'.format(
            dt.strftime('%I %p'),
            format_t(hour['summary']),
            round_n(hour['temperature'])
        ))

    print()
    print('Daily breakdown')
    print('---------------')
    for day in data['daily']['data']:
        dt = datetime.fromtimestamp(day['time'])
        print('On {}: {}, with a temp. range of {}° to {}°, with {}% humidity and {}% chance of {}'.format(
            dt.strftime('%a %m/%d'),
            format_t(day['summary']),
            round_n(day['temperatureLow']),
            round_n(day['temperatureHigh']),
            round_n(day['humidity'] * 100),
            round_n(day['precipProbability'] * 100),
            day['precipType']
        ))


if __name__ == '__main__':
    main()
