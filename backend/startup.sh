#!/bin/bash

# Exit script if any command fails
set -e

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
python3 -m pip install --upgrade pip

# Install additional dependencies based on the operating system
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux (Debian-based) commands
    sudo apt-get update
    sudo apt-get install -y python3-dev python3-setuptools
    sudo apt-get install -y libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
        libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
        libharfbuzz-dev libfribidi-dev libxcb1-dev
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS commands
    # brew install libtiff libjpeg openjpeg zlib freetype lcms2 webp tcl-tk harfbuzz fribidi
    arch -x86_64 brew install libtiff libjpeg openjpeg zlib freetype lcms2 webp tcl-tk harfbuzz fribidi
else
    echo "Unsupported operating system"
    exit 1
fi

# Install required packages with pip
pip install -r requirements.txt

# Run migrations
chmod +x manage.py
python3 ./manage.py makemigrations
python3 ./manage.py migrate

# Deactivate virtual environment
deactivate
