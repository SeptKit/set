"""
XSD Helper Module
Provides direct XML parsing utilities for XSD files when the xmlschema library doesn't provide enough access.
"""
import os
import xml.etree.ElementTree as ET
from typing import Dict, Any, List, Optional, Set, Tuple

# XML namespace for XML Schema
XS_NS = '{http://www.w3.org/2001/XMLSchema}'

def get_type_patterns(xsd_file_path: str, type_name: str) -> List[str]:
    """
    Directly parse an XSD file to extract pattern restrictions for a named type.
    
    Args:
        xsd_file_path: Path to the XSD file
        type_name: Name of the type to find patterns for
        
    Returns:
        List of pattern strings
    """
    if not os.path.exists(xsd_file_path):
        return []
        
    patterns = []
    
    try:
        # Parse the XSD file
        tree = ET.parse(xsd_file_path)
        root = tree.getroot()
        
        # Find the simpleType with the specified name
        for simple_type in root.findall(f'.//{XS_NS}simpleType[@name="{type_name}"]'):
            # Look for pattern restrictions
            for restriction in simple_type.findall(f'.//{XS_NS}restriction'):
                for pattern in restriction.findall(f'.//{XS_NS}pattern'):
                    if 'value' in pattern.attrib:
                        patterns.append(pattern.attrib['value'])
    except Exception as e:
        print(f"Error parsing XSD file {xsd_file_path} for type {type_name}: {e}")
        
    return patterns

def get_all_xsd_files(base_dir: str) -> List[str]:
    """
    Get all XSD files in a directory.
    
    Args:
        base_dir: Base directory to search
        
    Returns:
        List of XSD file paths
    """
    xsd_files = []
    
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.xsd'):
                xsd_files.append(os.path.join(root, file))
                
    return xsd_files

def find_type_in_xsd_files(xsd_files: List[str], type_name: str) -> Optional[str]:
    """
    Find a type definition in a list of XSD files.
    
    Args:
        xsd_files: List of XSD file paths
        type_name: Name of the type to find
        
    Returns:
        Path to the XSD file containing the type, or None if not found
    """
    for xsd_file in xsd_files:
        try:
            tree = ET.parse(xsd_file)
            root = tree.getroot()
            
            # Check for simpleType or complexType with the specified name
            for type_elem in root.findall(f'.//{XS_NS}simpleType[@name="{type_name}"]') + \
                            root.findall(f'.//{XS_NS}complexType[@name="{type_name}"]'):
                return xsd_file
        except Exception as e:
            print(f"Error searching XSD file {xsd_file} for type {type_name}: {e}")
            
    return None
