#!/bin/bash

# Activate virtual environment
source venv/bin/activate

python3 ./manage.py loaddata data.json

# Start the server
python3 ./manage.py runserver
