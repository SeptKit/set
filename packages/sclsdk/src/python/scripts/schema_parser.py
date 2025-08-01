"""
Schema Parser Module
Loads and parses IEC 61850 SCL XSD schemas.
"""
# import os
import xmlschema
# from lxml import etree
from typing import Dict, Any, List
# from typing import Dict, Any, List, Optional, Set

class SchemaParser:
    """
    Loads and parses the XSD schema from the entry point file,
    resolving all imported/included XSDs.
    """
    def __init__(self, entry_point: str):
        """
        Initialize the SchemaParser with the entry point XSD file.
        
        Args:
            entry_point: Path to the main XSD file (SCL.xsd)
        """
        self.entry_point = entry_point
        self.schema = None
        self.namespace_map = {}
        self.processed_types = set()  # Track processed types to avoid infinite recursion
        self.processed_elements = set()
        
    def load_schema(self) -> xmlschema.XMLSchema:
        """
        Load the XSD schema from the entry point file.
        
        Returns:
            The loaded XMLSchema object
        """
        try:
            # Load the schema with options to ensure all imports and includes are processed
            self.schema = xmlschema.XMLSchema(
              self.entry_point, 
              build=True,  # Build the schema (process all imports)
              validation='strict',  # Strict validation
              locations=None,  # Auto-detect locations for imports
              base_url=None,  # Use entry_point directory as base URL
              defuse='never',  # Don't defuse XML entities
              timeout=300,  # Longer timeout for complex schemas
            )
        except Exception as e:
            print(f"Error loading schema: {e}")
            raise
        
        # Map namespaces for easier access
        for ns, url in self.schema.namespaces.items():
            self.namespace_map[ns] = url
            
        # Print schema info for debugging
        self._print_schema_info()
            
        return self.schema
    
    def _print_schema_info(self):
        """
        Print information about the loaded schema for debugging purposes.
        """
        if not self.schema:
            print("Schema not loaded")
            return
            
        # Print imported schemas
        imports_count = 0
        print("Imported schemas:")
        for url, ns in self.schema.imports.items():
            if url:  # Skip the schema itself
                print(f"  - {url} (namespace: {ns})")
                imports_count += 1
        
        if imports_count == 0:
            print("  No imports found")
                
        # Print included schemas
        includes_count = 0
        print("Included schemas:")
        for url in self.schema.includes:
            print(f"  - {url}")
            includes_count += 1
            
        if includes_count == 0:
            print("  No includes found")
            
        # Print some global elements for verification
        print("\nSample of global elements:")
        element_count = 0
        for name in list(self.schema.elements.keys())[:10]:  # Show first 10 elements
            print(f"  - {name}")
            element_count += 1
            
        if element_count == 0:
            print("  No global elements found!")
            
        # Print some types for verification
        print("\nSample of types:")
        type_count = 0
        for name in list(self.schema.types.keys())[:10]:  # Show first 10 types
            print(f"  - {name}")
            type_count += 1
            
        if type_count == 0:
            print("  No types found!")
            
        # Check components to make sure schema is fully built
        types_count = len(self.schema.types)
        elements_count = len(self.schema.elements)
        
        if types_count == 0 or elements_count == 0:
            print("\nWARNING: Schema appears to be empty or not fully loaded!")
        else:
            print(f"\nSchema appears to be fully loaded.")
    
    # def get_all_types(self) -> Dict[str, Any]:
    #     """
    #     Extract all types defined in the schema.
        
    #     Returns:
    #         Dictionary of type names to type objects
    #     """
    #     if not self.schema:
    #         self.load_schema()
            
    #     types = {}
    #     # Get all complex types
    #     for name, type_obj in self.schema.types.items():
    #         if isinstance(type_obj, xmlschema.validators.XsdComplexType) or isinstance(type_obj, xmlschema.validators.XsdSimpleType):
    #             types[name] = type_obj
        
    #     return types
        
    # def get_all_elements(self) -> Dict[str, Any]:
    #     """
    #     Extract all elements defined in the schema.
        
    #     Returns:
    #         Dictionary of element names to element objects
    #     """
    #     if not self.schema:
    #         self.load_schema()
            
    #     elements = {}
    #     # Get all global elements
    #     for name, element in self.schema.elements.items():
    #         elements[name] = element
            
    #     return elements
    
    def get_base_type(self, type_obj: Any) -> str:
        """
        Get the base XSD type of a type object.
        
        Args:
            type_obj: XSD type object
            
        Returns:
            String representing the base type
        """
        # For debugging, print type information
        type_name = getattr(type_obj, 'name', None)
        type_class = type_obj.__class__.__name__ if type_obj else None
        
        if isinstance(type_obj, xmlschema.validators.XsdSimpleType):
            # Handle simple types
            if type_obj.is_restriction():
                # Check if it's an enumeration
                if type_obj.enumeration:
                    return 'enum'
                # Otherwise, get the base type
                return self.get_base_type(type_obj.base_type)
            elif hasattr(type_obj, 'member_types') and type_obj.member_types:
                # Handle union types
                return 'union'
            else:
                # If it's a built-in type, return its name
                type_name = type_obj.name
                # Remove namespace if present
                if isinstance(type_name, str) and "}" in type_name:
                    type_name = type_name.split("}")[-1]
                return type_name
        elif isinstance(type_obj, xmlschema.validators.XsdComplexType):
            # Handle complex types with simple content
            if type_obj.content:
                if hasattr(type_obj.content, 'base_type'):
                    return self.get_base_type(type_obj.content.base_type)
            return 'complex'
        else:
            # Default case
            return 'string'
    
    # def get_enumerations(self, type_obj: Any) -> List[str]:
    #     """
    #     Extract enumeration values from a type.
        
    #     Args:
    #         type_obj: XSD type object
            
    #     Returns:
    #         List of enumeration values or empty list
    #     """
    #     enums = []
        
    #     if isinstance(type_obj, xmlschema.validators.XsdSimpleType) and type_obj.enumeration:
    #         enums = list(type_obj.enumeration)
    #     elif isinstance(type_obj, xmlschema.validators.XsdComplexType) and type_obj.content:
    #         if hasattr(type_obj.content, 'base_type'):
    #             return self.get_enumerations(type_obj.content.base_type)
                
    #     return enums
    
    # def get_restriction_facets(self, type_obj: Any) -> Dict[str, Any]:
    #     """
    #     Extract restriction facets from a type.
        
    #     Args:
    #         type_obj: XSD type object
            
    #     Returns:
    #         Dictionary of restriction facets
    #     """
    #     facets = {}
        
    #     # Handle case when type_obj is None
    #     if type_obj is None:
    #         return facets
            
    #     # Avoid infinite recursion by checking type name
    #     type_name = getattr(type_obj, 'name', None)
    #     if type_name in self.processed_types:
    #         return facets
            
    #     if type_name:
    #         self.processed_types.add(type_name)
            
    #     # Get the type name if it's a reference to another type
    #     if hasattr(type_obj, 'base_type') and type_obj.base_type is not None:
    #         # Merge facets from base type
    #         base_facets = self.get_restriction_facets(type_obj.base_type)
    #         facets.update(base_facets)
        
    #     # Check if it's a simple type with facets
    #     if isinstance(type_obj, xmlschema.validators.XsdSimpleType):
    #         # Add type information for debugging
    #         if hasattr(type_obj, 'name') and type_obj.name:
    #             facets['type_name'] = type_obj.name
                
    #         # Handle union types
    #         if hasattr(type_obj, 'member_types') and type_obj.member_types:
    #             facets['is_union'] = True
    #             union_facets = []
    #             for member in type_obj.member_types:
    #                 member_facets = self.get_restriction_facets(member)
    #                 if member_facets:
    #                     union_facets.append(member_facets)
    #             if union_facets:
    #                 facets['union_members'] = union_facets
                
    #         # Handle enumerations
    #         if hasattr(type_obj, 'enumeration') and type_obj.enumeration:
    #             facets['enumeration'] = list(type_obj.enumeration)
                
    #         # Explicitly handle patterns from XSD restrictions
    #         if hasattr(type_obj, 'patterns') and type_obj.patterns:
    #             patterns = []
    #             for pattern in type_obj.patterns:
    #                 if hasattr(pattern, 'pattern'):
    #                     patterns.append(pattern.pattern)
    #                 elif hasattr(pattern, 'value'):
    #                     patterns.append(pattern.value)
    #                 else:
    #                     patterns.append(str(pattern))
    #             facets['pattern'] = patterns
            
    #         # Handle facets
    #         if hasattr(type_obj, 'facets'):
    #             for facet_name, facet_obj in type_obj.facets.items():
    #                 if facet_name == 'enumeration':
    #                     facets['enumeration'] = list(type_obj.enumeration)
    #                 elif facet_name == 'pattern':
    #                     # Handle pattern objects differently based on the xmlschema version
    #                     if isinstance(facet_obj, list):
    #                         patterns = []
    #                         for pattern_obj in facet_obj:
    #                             if hasattr(pattern_obj, 'pattern'):
    #                                 patterns.append(pattern_obj.pattern)
    #                             elif hasattr(pattern_obj, 'value'):
    #                                 patterns.append(pattern_obj.value)
    #                         facets['pattern'] = patterns
    #                     else:
    #                         facets['pattern'] = [facet_obj.value]
    #                 elif facet_name == 'length':
    #                     facets['length'] = facet_obj.value
    #                 elif facet_name == 'minLength':
    #                     facets['minLength'] = facet_obj.value
    #                 elif facet_name == 'maxLength':
    #                     facets['maxLength'] = facet_obj.value
    #                 elif facet_name == 'minInclusive':
    #                     facets['minInclusive'] = facet_obj.value
    #                 elif facet_name == 'maxInclusive':
    #                     facets['maxInclusive'] = facet_obj.value
    #                 elif facet_name == 'minExclusive':
    #                     facets['minExclusive'] = facet_obj.value
    #                 elif facet_name == 'maxExclusive':
    #                     facets['maxExclusive'] = facet_obj.value
    #                 elif facet_name == 'whiteSpace':
    #                     facets['whiteSpace'] = facet_obj.value
    #                 elif facet_name == 'totalDigits':
    #                     facets['totalDigits'] = facet_obj.value
    #                 elif facet_name == 'fractionDigits':
    #                     facets['fractionDigits'] = facet_obj.value
                
    #     # Check if it's a complex type with simple content
    #     elif isinstance(type_obj, xmlschema.validators.XsdComplexType):
    #         if hasattr(type_obj, 'name') and type_obj.name:
    #             facets['type_name'] = type_obj.name
                
    #         if hasattr(type_obj, 'content') and type_obj.content:
    #             if hasattr(type_obj.content, 'base_type'):
    #                 content_facets = self.get_restriction_facets(type_obj.content.base_type)
    #                 facets.update(content_facets)
        
    #     # If we have a named type and it's not a built-in type, look it up in the schema
    #     elif isinstance(type_name, str) and not type_name.startswith('xs:'):
    #         # Try to look up the type in the schema's types dictionary
    #         referenced_type = self.schema.types.get(type_name)
    #         if referenced_type:
    #             ref_facets = self.get_restriction_facets(referenced_type)
    #             facets.update(ref_facets)
                
    #     return facets
    
    def flatten_union_enumerations(self, facets: Dict[str, Any]) -> List[str]:
        """
        Recursively extract and flatten all enumeration values from union types.
        
        Args:
            facets: Dictionary containing validation facets, possibly with union_members
            
        Returns:
            A flat list of all enumeration values
        """
        all_enums = []
        
        # If this facet has direct enumerations, add them
        if 'enumeration' in facets:
            all_enums.extend(facets['enumeration'])
            
        # If this is a union type, process all member types
        if 'is_union' in facets and 'union_members' in facets:
            for member in facets['union_members']:
                # Recursively extract enumerations from each member
                member_enums = self.flatten_union_enumerations(member)
                all_enums.extend(member_enums)
                
        return all_enums
        
    def get_type_elements(self, type_obj):
        """
        Extract elements from a complex type.
        
        Args:
            type_obj: XSD type object
            
        Returns:
            List of element objects
        """
        elements = []
        
        if hasattr(type_obj, 'content') and type_obj.content:
            content = type_obj.content
            
            # Check if it's a complex content type with elements
            if hasattr(content, 'iter_elements'):
                try:
                    for element in content.iter_elements():
                        if isinstance(element, tuple) and len(element) == 2:
                            _, elem = element
                            elements.append(elem)
                        else:
                            elements.append(element)
                except Exception as e:
                    print(f"Warning: Failed to extract elements from type: {e}")
                    
        return elements
