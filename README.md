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
cd ..
```

## Deploying

### Frontend

You'll need to change the [Surge](https://surge.sh) target website in `./client/package.json`.

```sh
cd client
yarn build
yarn deploy
```

### Backend

You'll need to set up a resource group in Azure, and then either use the Azure CLI or the VS Code plugin to deploy the code.
