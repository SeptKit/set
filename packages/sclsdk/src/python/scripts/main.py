"""
Main entry point for the IEC 61850 SCL XSD to JSON/TypeScript Schema Converter.
"""
import os
import argparse
import sys
# from typing import Dict, Any, List, Optional

from schema_parser import SchemaParser
from element_extractor import ElementExtractor
from json_converter import JsonConverter

def main():
    """
    Main entry point for the converter.
    """
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='IEC 61850 SCL XSD to JSON/TypeScript Schema Converter')
    parser.add_argument('--xsd', required=True, help='Path to the SCL.xsd entry point file')
    parser.add_argument('--output', required=True, help='Path to save the output JSON file')
    parser.add_argument('--verbose', action='store_true', help='Enable verbose output')
    args = parser.parse_args()
    
    # Check if input file exists
    if not os.path.exists(args.xsd):
        print(f"Error: Input file '{args.xsd}' does not exist.")
        sys.exit(1)
        
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(args.output)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # Initialize schema parser
    print(f"Loading schema from '{args.xsd}'...")
    schema_parser = SchemaParser(args.xsd)
    # schema = schema_parser.load_schema()
    
    # Extract elements
    print("Extracting elements...")
    element_extractor = ElementExtractor(schema_parser)
    elements = element_extractor.extract_elements()
    
    # Print element count for verification
    print(f"Extracted {len(elements)} elements.")
    
    if args.verbose:
        print("Element list:")
        for name in sorted(elements.keys()):
            print(f"  - {name}")
    
    # Convert to JSON
    print("Converting to JSON...")
    converter = JsonConverter(elements)
    
    # Save to file
    print(f"Saving to '{args.output}'...")
    converter.save_to_file(args.output)
    
    print(f"Done! Generated JSON schema with {len(elements)} elements.")
    
    # Save element names to a separate file for quick reference
    element_names_file = os.path.join(output_dir, "element_names.txt")
    with open(element_names_file, 'w') as f:
        for name in sorted(elements.keys()):
            f.write(f"{name}\n")
    print(f"Element names saved to '{element_names_file}'")

if __name__ == '__main__':
    main()
