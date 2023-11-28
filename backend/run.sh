#!/bin/bash

# Activate virtual environment
source venv/bin/activate

python3 ./manage.py loaddata mock_data.json

# Start the server
python3 ./manage.py runserver
