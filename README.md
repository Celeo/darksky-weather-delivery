# darksky-weather-delivery

A simple frontend+backend to give me the Dark Sky weather forecast for my home.

## Why

Dark Sky sold out to Apple. Their website will be shut down on July 1, 2020, but the API will remain available (for people
who already have access) until the end of 2021.

## Components

- `./client` is a React 16 app from [create-react-app](https://github.com/facebook/create-react-app)
- `./darkskywdfunction` is an [Azure Function](https://azure.microsoft.com/en-us/services/functions/)

## Getting started

```sh
git clone https://github.com/Celeo/darksky-weather-delivery
cd darksky-weather-delivery/client
yarn
cd ../darkskywdfunction
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
echo '{}' > local.settings.json
cd ..
```

Then, populate `local.settings.json` with:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "DARK_SKY_SECRET_KEY": "<key>",
    "DARK_SKY_LOCATION": "<lat>,<long>"
  },
  "Host": {
    "CORS": "*"
  }
}
```

## Deploying

### Backend

You'll need to set up a resource group in Azure, and then either use the Azure CLI or the VS Code plugin to deploy the function.

### Frontend

1. Add a [Surge](https://surge.sh) target website in `./client/CNAME`.
1. Create a file in `./client/.env.production.local` and populate with `REACT_APP_API_URL=<your Azure function endpoint>`
1. Run:

```sh
cd client
yarn build
yarn deploy
```
