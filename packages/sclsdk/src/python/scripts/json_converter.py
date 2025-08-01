"""
JSON Converter Module
Converts e                # Handle union types with enumeration values
                validation = attr_details.get("validation", {})
                if attr_name == "lnClass" and validation:
                    # Check if we have enumeration values from flattened unions
                    if isinstance(validation, dict) and "enumeration" in validation:
                        attr_details["validation"] = {"value": {"enumeration": validation["enumeration"]}}
                    # Or if we have a nested complex structure, flatten it
                    elif isinstance(validation, dict) and "is_union" in validation:
                        all_enums = self._extract_enums_from_validation(validation)
                        if all_enums:
                            attr_details["validation"] = {"value": {"enumeration": all_enums}}hema information to JSON structure.
"""
import json
from typing import Dict, Any, List, Optional

class JsonConverter:
    """
    Converts extracted schema information to JSON structure
    that matches the required TypeScript interface.
    """
    def __init__(self, elements: Dict[str, Any]):
        """
        Initialize the JsonConverter with extracted elements.
        
        Args:
            elements: Dictionary of extracted elements
        """
        self.elements = elements
        
    def convert(self) -> Dict[str, Any]:
        """
        Convert the extracted elements to the required JSON structure.
        
        Returns:
            JSON data that matches the TypeScript interface
        """
        json_data = {}
        
        # Process each element and format according to TypeScript interface
        for key, element in self.elements.items():
            json_data[key] = element
            
            # Process attributes
            for attr_name, attr_details in element.get("attributes", {}).get("details", {}).items():
                # Handle union types with enumeration values
                validation = attr_details.get("validation", {})
                if attr_name == "lnClass" and validation:
                    # Check if we have enumeration values from flattened unions
                    if isinstance(validation, dict) and "enumeration" in validation:
                        attr_details["validation"] = {"enumeration": validation["enumeration"]}
                    # Or if we have a nested complex structure, flatten it
                    elif isinstance(validation, dict) and "is_union" in validation:
                        all_enums = self._extract_enums_from_validation(validation)
                        if all_enums:
                            attr_details["validation"] = {"enumeration": all_enums}
                    
        return json_data
        
    def _extract_enums_from_validation(self, validation: Dict[str, Any]) -> List[str]:
        """
        Extract all enumeration values from a nested validation structure.
        
        Args:
            validation: Dictionary containing validation rules
            
        Returns:
            List of all enumeration values
        """
        all_enums = []
        
        # Direct enumerations
        if "enumeration" in validation:
            if isinstance(validation["enumeration"], list):
                all_enums.extend(validation["enumeration"])
        
        # Union members
        if "is_union" in validation and "union_members" in validation:
            for member in validation["union_members"]:
                member_enums = self._extract_enums_from_validation(member)
                all_enums.extend(member_enums)
                
        return all_enums
        
    def save_to_file(self, filepath: str) -> None:
        """
        Save the JSON data to a file.
        
        Args:
            filepath: Path to save the JSON file
        """
        with open(filepath, 'w') as f:
            json.dump(self.convert(), f, indent=2)
            
    def to_json_string(self) -> str:
        """
        Convert the data to a JSON string.
        
        Returns:
            JSON string representation
        """
        return json.dumps(self.convert(), indent=2)
