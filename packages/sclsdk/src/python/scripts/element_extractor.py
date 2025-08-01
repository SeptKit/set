"""
Element Extractor Module
Extracts elements, attributes, and their properties from the XSD schema.
"""
import xmlschema
from xmlschema.validators import XsdAnyAttribute, XsdAnyElement, XsdUnique
from typing import Dict, Any, List, Optional, Set, Tuple
import re

# def to_camel_case(name: str) -> str:
#     """
#     Convert string to camelCase.
    
#     Args:
#         name: The string to convert
        
#     Returns:
#         camelCase string
#     """
#     if not name:
#         return ""
        
#     # Handle already camelCase or PascalCase names
#     # Handle special cases like "SCL", "IED" that might be all caps
#     if name == name.upper():
#         name = name.lower()
#     else:
#         # Regular camelCase conversion for simple names
#         name = re.sub(r'[-_\s]+(.)?', lambda match: match.group(1).upper() if match.group(1) else '', name)
#         name = re.sub(r'^([A-Z])', lambda match: match.group(1).lower(), name)
  
#     return name

class ElementExtractor:
    """
    Extracts elements, attributes, and their properties from the XSD schema.
    """
    def __init__(self, schema_parser):
        """
        Initialize the ElementExtractor with a SchemaParser.
        
        Args:
            schema_parser: The SchemaParser instance with a loaded schema
        """
        self.schema_parser = schema_parser
        self.schema = schema_parser.schema
        if not self.schema:
            self.schema = schema_parser.load_schema()
    
###
### ELEMENT EXTRACTION
###
    def get_namespace_info(self, qname: str, namespace_map: dict) -> dict:
        """
        Extract namespace URI and prefix from a qualified name.
        """
        if "}" in qname:
            uri, local = qname[1:].split("}")
            # Find prefix from namespace_map
            prefix = None
            for pfx, ns_uri in namespace_map.items():
                if ns_uri == uri:
                    prefix = pfx
                    break
            return {"uri": uri, "prefix": prefix or ""}
        return {"uri": "", "prefix": ""}
    

    def extract_elements(self) -> Dict[str, Any]:
        """
        Extract all elements with their properties.
        
        Returns:
            Dictionary of elements in the format required by the TypeScript interface
        """
        elements = {}
        processed_elements = set()
        
        root_elements = self.get_root_elements()
        
        # Process each root element and its children recursively
        for name, element in root_elements.items():
            self.get_children_recursively(element, elements, processed_elements)
            
        print(f"Extracted a total of {len(elements)} elements (including nested elements)")
        return elements
    
    def get_root_elements(self) -> Dict[str, Any]:
        """
        Extract all root elements defined in the schema.
        
        Returns:
            Dictionary of element names to element objects
        """

        elements = {}
        # Get all global elements
        for name, element in self.schema.elements.items():
            elements[name] = element
            
        return elements
        

    def get_children_recursively(self, element, elements_dict, processed_elements):
        """
        Recursively extract an element and all its child elements.
        
        Args:
            element: XSD element object
            elements_dict: Dictionary to store extracted elements
            processed_elements: Set of already processed element names to avoid duplication
        """
        # Skip if already processed
        element_name = element.name
        if element_name in processed_elements:
            return
            
        # Mark as processed
        processed_elements.add(element_name)
        
        # Extract the local name without namespace if present
        if isinstance(element_name, str) and "}" in element_name:
            local_name = element_name.split("}")[-1]
        else:
            local_name = element_name
        
        # Generate camelCase key
        key = local_name
        
        # Extract element properties
        element_data = {
            "tag": local_name,
            "namespace": self.get_namespace_info(element_name, self.schema_parser.namespace_map),
            "attributes": self.get_element_attributes(element),
            "subElements": self.extract_sub_elements(element),
            "validation": self.extract_validation(element)
        }
        
        # Add to elements dictionary
        elements_dict[key] = element_data
        
        # Process child elements recursively
        element_type = element.type
        
        # Process child elements if it's a complex type with content
        if hasattr(element_type, 'content') and element_type.content:
            content = element_type.content
            
            # Handle complex content with elements
            if isinstance(content, xmlschema.validators.XsdGroup):
                try:
                    for child_element in content.iter_elements():
                        # Check if the returned value is a tuple
                        if isinstance(child_element, tuple) and len(child_element) == 2:
                            child_name, child = child_element
                        else:
                            # If it's not a tuple, try to get the name from the element
                            child = child_element
                            child_name = getattr(child, 'name', None)
                        
                        # Skip anyElement and elements without a name
                        if child_name is None or isinstance(child, xmlschema.validators.XsdAnyElement):
                            continue
                            
                        # If it's a proper element with a type, process it recursively
                        if hasattr(child, 'type'):
                            self.get_children_recursively(child, elements_dict, processed_elements)
                except Exception as e:
                    print(f"Warning: Failed to process child elements: {e}")
    
###
### ATTRIBUTES EXTRACTION
###

    def get_element_attributes(self, element: Any) -> Dict[str, Any]:
        """
        Extract attributes for a given element.
        
        Args:
            element: XSD element object
            
        Returns:
            Dictionary of attributes in the format required by the TypeScript interface
        """
        attributes = {
            "any": False,
            "available": [],
            "details": {},
        }
        
        # Get the type of the element
        element_type = element.type
        
        # Extract attributes from the element type
        if hasattr(element_type, 'attributes'):
            for attribute_name, attribute in element_type.attributes.items():
                
                # Set any attribute flag if applicable
                if isinstance(attribute, XsdAnyAttribute):
                    attributes["any"] = True

                # Skip null attributes
                if attribute_name is None:
                    continue
                    
                # Extract the local name without namespace if present
                if isinstance(attribute_name, str) and "}" in attribute_name:
                    local_attribute_name = attribute_name.split("}")[-1]
                else:
                    local_attribute_name = attribute_name
                    
                attributes["available"].append(local_attribute_name)

                attr_namespace_info = self.get_namespace_info(attribute_name, self.schema_parser.namespace_map)
                
                # Get enumerations
                # enums = self.schema_parser.get_enumerations(attribute.type)
                
                # Create attribute details
                attribute_details = {
                    "type": self.schema_parser.get_base_type(attribute.type),
                    "namespace": attr_namespace_info,
                    "required": attribute.use == 'required',
                    "default": attribute.default if attribute.default is not None else None,
                    #"enum": enums,
                    #"validation": self.get_restriction_facets(attribute.type)
                }
                
                attributes["details"][local_attribute_name] = attribute_details
                
        return attributes
    
###
### VALIDATION
###
    def get_restriction_facets(self, type_obj: Any) -> Dict[str, Any]:
        """
        Extract restriction facets from a type.
        
        Args:
            type_obj: XSD type object
            
        Returns:
            Dictionary of restriction facets
        """
        facets = {}
        
        # Handle case when type_obj is None
        if type_obj is None:
            return facets
            
        # Avoid infinite recursion by checking type name
        type_name = getattr(type_obj, 'name', None)
        if type_name in self.processed_types:
            return facets
            
        if type_name:
            self.processed_types.add(type_name)
            
        # Get the type name if it's a reference to another type
        if hasattr(type_obj, 'base_type') and type_obj.base_type is not None:
            # Merge facets from base type
            base_facets = self.get_restriction_facets(type_obj.base_type)
            facets.update(base_facets)
        
        # Check if it's a simple type with facets
        if isinstance(type_obj, xmlschema.validators.XsdSimpleType):
            # Add type information for debugging
            if hasattr(type_obj, 'name') and type_obj.name:
                facets['type_name'] = type_obj.name
                
            # Handle union types
            if hasattr(type_obj, 'member_types') and type_obj.member_types:
                facets['is_union'] = True
                union_facets = []
                for member in type_obj.member_types:
                    member_facets = self.get_restriction_facets(member)
                    if member_facets:
                        union_facets.append(member_facets)
                if union_facets:
                    facets['union_members'] = union_facets
                
            # Handle enumerations
            if hasattr(type_obj, 'enumeration') and type_obj.enumeration:
                facets['enumeration'] = list(type_obj.enumeration)
                
            # Explicitly handle patterns from XSD restrictions
            if hasattr(type_obj, 'patterns') and type_obj.patterns:
                patterns = []
                for pattern in type_obj.patterns:
                    if hasattr(pattern, 'pattern'):
                        patterns.append(pattern.pattern)
                    elif hasattr(pattern, 'value'):
                        patterns.append(pattern.value)
                    else:
                        patterns.append(str(pattern))
                facets['pattern'] = patterns
            
            # Handle facets
            if hasattr(type_obj, 'facets'):
                for facet_name, facet_obj in type_obj.facets.items():
                    if facet_name == 'enumeration':
                        facets['enumeration'] = list(type_obj.enumeration)
                    elif facet_name == 'pattern':
                        # Handle pattern objects differently based on the xmlschema version
                        if isinstance(facet_obj, list):
                            patterns = []
                            for pattern_obj in facet_obj:
                                if hasattr(pattern_obj, 'pattern'):
                                    patterns.append(pattern_obj.pattern)
                                elif hasattr(pattern_obj, 'value'):
                                    patterns.append(pattern_obj.value)
                            facets['pattern'] = patterns
                        else:
                            facets['pattern'] = [facet_obj.value]
                    elif facet_name == 'length':
                        facets['length'] = facet_obj.value
                    elif facet_name == 'minLength':
                        facets['minLength'] = facet_obj.value
                    elif facet_name == 'maxLength':
                        facets['maxLength'] = facet_obj.value
                    elif facet_name == 'minInclusive':
                        facets['minInclusive'] = facet_obj.value
                    elif facet_name == 'maxInclusive':
                        facets['maxInclusive'] = facet_obj.value
                    elif facet_name == 'minExclusive':
                        facets['minExclusive'] = facet_obj.value
                    elif facet_name == 'maxExclusive':
                        facets['maxExclusive'] = facet_obj.value
                    elif facet_name == 'whiteSpace':
                        facets['whiteSpace'] = facet_obj.value
                    elif facet_name == 'totalDigits':
                        facets['totalDigits'] = facet_obj.value
                    elif facet_name == 'fractionDigits':
                        facets['fractionDigits'] = facet_obj.value
                
        # Check if it's a complex type with simple content
        elif isinstance(type_obj, xmlschema.validators.XsdComplexType):
            if hasattr(type_obj, 'name') and type_obj.name:
                facets['type_name'] = type_obj.name
                
            if hasattr(type_obj, 'content') and type_obj.content:
                if hasattr(type_obj.content, 'base_type'):
                    content_facets = self.get_restriction_facets(type_obj.content.base_type)
                    facets.update(content_facets)
        
        # If we have a named type and it's not a built-in type, look it up in the schema
        elif isinstance(type_name, str) and not type_name.startswith('xs:'):
            # Try to look up the type in the schema's types dictionary
            referenced_type = self.schema.types.get(type_name)
            if referenced_type:
                ref_facets = self.get_restriction_facets(referenced_type)
                facets.update(ref_facets)
                
        return facets

###
### SUB ELEMENTS
###

    def extract_sub_elements(self, element: Any) -> Dict[str, Any]:
        """
        Extract sub-elements for a given element.
        
        Args:
            element: XSD element object
            
        Returns:
            Dictionary of sub-elements in the format required by the TypeScript interface
        """
        sub_elements = {
            "any": False,
            "available": [],
            "details": {}
        }
        
        # Get the type of the element
        element_type = element.type
        
        # Extract sub-elements from the element type
        if hasattr(element_type, 'content') and element_type.content:
            content = element_type.content
            
            # Handle complex content with elements
            if isinstance(content, xmlschema.validators.XsdGroup):
                # Use a try-except block to handle the case when iter_elements doesn't return elements
                try:
                    for child_element in content.iter_elements():
                        
                        if isinstance(sub_elements, XsdAnyElement):
                            sub_elements["any"] = True

                        # Check if the returned value is a tuple
                        if isinstance(child_element, tuple) and len(child_element) == 2:
                            child_name, child = child_element
                        else:
                            # If it's not a tuple, try to get the name from the element
                            child = child_element
                            child_name = getattr(child, 'name', f"element_{len(sub_elements['available'])}")
                            
                        # Extract the local name without namespace
                        if isinstance(child_name, str) and "}" in child_name:
                            local_name = child_name.split("}")[-1]
                        else:
                            local_name = child_name
                            
                        # Skip null values
                        if local_name is None:
                            continue
                            
                        # Convert to camelCase for available elements
                        sub_elements["available"].append(local_name)
                        
                        # Create sub-element details
                        sub_element_details = {
                            "required": getattr(child, 'min_occurs', 0) > 0,
                            "minOccurrence": getattr(child, 'min_occurs', None),
                            "maxOccurrence": getattr(child, 'max_occurs', 1) if getattr(child, 'max_occurs', None) != None else None
                        }
                        
                        # Use camelCase key for details
                        sub_elements["details"][local_name] = sub_element_details
                except Exception as e:
                    print(f"Warning: Failed to extract sub-elements: {e}")
                    # Continue processing other elements
        
        return sub_elements

    def extract_validation(self, element: Any) -> Dict[str, Any]:
        """
        Extract validation rules for a given element.
        
        Args:
            element: XSD element object
            
        Returns:
            Dictionary of validation rules in the format required by the TypeScript interface
        """
        validation = {
            "value": {},
            "uniqueness": self._extract_uniqueness(element)
        }
        
        try:
            # Get the type of the element
            element_type = element.type
            
            # For debugging, add type information
            type_name = getattr(element_type, 'name', None)
            if type_name:
                validation["value"]["type_name"] = type_name
                
            # Extract value restrictions
            if isinstance(element_type, xmlschema.validators.XsdSimpleType) or (
                isinstance(element_type, xmlschema.validators.XsdComplexType)
            ):
                # Reset processed types set to ensure fresh traversal for each element
                self.schema_parser.processed_types = set()
                
                # Get facets from the type
                facets = self.schema_parser.get_restriction_facets(element_type)
                if facets:
                    # Check if this is a union type with members
                    if 'is_union' in facets and 'union_members' in facets:
                        # Flatten all enumeration values from union members
                        all_enums = self.schema_parser.flatten_union_enumerations(facets)
                        if all_enums:
                            # Create a simplified structure with just the enumerations
                            validation["value"] = {"enumeration": all_enums}
                            # Debug print for LN Class
                            if type_name and 'LNClass' in type_name:
                                print(f"Debug: Found LNClass with {len(all_enums)} enums")
                                print(f"Debug: First few enums: {all_enums[:5]}")
                        else:
                            # If no enumerations found, use the original facets
                            validation["value"] = facets
                    else:
                        # Not a union type, use facets as is
                        validation["value"] = facets
                    
            # If the type has a base type, also get its facets
            if hasattr(element_type, 'base_type') and element_type.base_type is not None:
                base_facets = self.schema_parser.get_restriction_facets(element_type.base_type)
                if base_facets:
                    # Check if base type is a union with enumerations
                    if 'is_union' in base_facets and 'union_members' in base_facets:
                        all_enums = self.schema_parser.flatten_union_enumerations(base_facets)
                        if all_enums and 'enumeration' not in validation["value"]:
                            validation["value"]["enumeration"] = all_enums
                    else:
                        # Merge with existing facets, prioritizing more specific ones
                        for key, value in base_facets.items():
                            if key not in validation["value"]:
                                validation["value"][key] = value
        
        except Exception as e:
            print(f"Warning: Error extracting validation for element {getattr(element, 'name', 'unknown')}: {e}")
        
        except Exception as e:
            print(f"Warning: Error extracting validation for element {getattr(element, 'name', 'unknown')}: {e}")
        
        return validation
    
    def _extract_uniqueness(self, element: Any) -> Dict[str, Any]:
        """
        Extract uniqueness constraints for an element.
        
        Args:
            element: XSD element object
            
        Returns:
            Dictionary representing uniqueness constraints
        """
        uniqueness = {
            "name": "",
            "tagNames": [],
            "attributes": []
        }
        
        # Check for unique constraints
        # Note: This is a simplified implementation
        # For IEC 61850 SCL, unique constraints might be more complex
        element_type = element.type
        try:
            if hasattr(element_type, 'identities'):
                for identity in element_type.identities:
                    if hasattr(identity, 'name') and identity.name:
                        uniqueness["name"] = identity.name
                        
                        # Extract fields from the identity
                        if hasattr(identity, 'fields'):
                            for field in identity.fields:
                                field_name = field
                                # Remove namespace if present
                                if isinstance(field_name, str) and "}" in field_name:
                                    field_name = field_name.split("}")[-1]
                                
                                if field_name.startswith('@'):
                                    # Attribute selector
                                    uniqueness["attributes"].append(field_name[1:])
                                else:
                                    # Element selector
                                    uniqueness["tagNames"].append(field_name)
        except Exception as e:
            print(f"Warning: Error extracting uniqueness constraints: {e}")
        
        return uniqueness
    
    def _has_any_attribute(self, element: Any) -> bool:
        """
        Check if an element allows any attribute.
        
        Args:
            element: XSD element object
            
        Returns:
            True if element allows any attribute, False otherwise
        """
        element_type = element.type
        return hasattr(element_type, 'open_content') and element_type.open_content is not None
    
    def _has_any_element(self, element: Any) -> bool:
        """
        Check if an element allows any sub-element.
        
        Args:
            element: XSD element object
            
        Returns:
            True if element allows any sub-element, False otherwise
        """
        element_type = element.type
        if hasattr(element_type, 'content') and element_type.content:
            content = element_type.content
            
            if isinstance(content, xmlschema.validators.XsdGroup):
                for child in content:
                    if isinstance(child, xmlschema.validators.XsdAnyElement):
                        return True
                        
        return False
    
    # def _process_child_elements(self, element, elements_dict, processed_elements):
    #     """
    #     Process all child elements of an element recursively.
        
    #     Args:
    #         element: XSD element object
    #         elements_dict: Dictionary to store extracted elements
    #         processed_elements: Set of already processed element names to avoid duplication
    #     """
    #     # Get the type of the element
    #     element_type = element.type
        
    #     # Process child elements if it's a complex type with content
    #     if hasattr(element_type, 'content') and element_type.content:
    #         content = element_type.content
            
    #         # Handle complex content with elements
    #         if isinstance(content, xmlschema.validators.XsdGroup):
    #             try:
    #                 for child_element in content.iter_elements():
    #                     # Check if the returned value is a tuple
    #                     if isinstance(child_element, tuple) and len(child_element) == 2:
    #                         child_name, child = child_element
    #                     else:
    #                         # If it's not a tuple, try to get the name from the element
    #                         child = child_element
    #                         child_name = getattr(child, 'name', None)
                        
    #                     # Skip anyElement and elements without a name
    #                     if child_name is None or isinstance(child, xmlschema.validators.XsdAnyElement):
    #                         continue
                            
    #                     # If it's a proper element with a type, process it recursively
    #                     if hasattr(child, 'type'):
    #                         self._recursive_extract_element(child, elements_dict, processed_elements)
    #             except Exception as e:
    #                 print(f"Warning: Failed to process child elements: {e}")
