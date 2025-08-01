#!/bin/bash
# Setup script for the IEC 61850 SCL XSD to JSON/TypeScript Schema Converter

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setup complete. You can now run the converter using:"
echo "source .venv/bin/activate"
echo "python src/main.py --xsd xsd/SCL.xsd --output output/definition.json"

echo "To merge edition and revision files, use:"
echo "python src/merge_edition_revision.py --definition output/definition.json --revision output/revision.json --output output/merged.json"

echo "To extract JSON keys to a JavaScript array, use:"
echo "python src/json_keys_to_js_array.py --input output/merged.json --output output/keys.js --var keys"