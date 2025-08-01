import json
import argparse

def load_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def merge_dicts(base, override):
    """
    Recursively merge two dictionaries.
    Values from override take precedence over base.
    """
    result = base.copy()
    for key, value in override.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = merge_dicts(result[key], value)
        else:
            result[key] = value
    return result

def main():
    parser = argparse.ArgumentParser(description="Merge two JSON files, with the second overwriting the first on conflicts.")
    parser.add_argument('--definition', required=True, help='Path to the definition JSON file')
    parser.add_argument('--revision', required=True, help='Path to the revision JSON file')
    parser.add_argument('--output', required=True, help='Path to the output merged JSON file')
    args = parser.parse_args()

    # Load JSON files
    definition = load_json(args.definition)
    revision = load_json(args.revision)

    # Merge with revision taking precedence
    merged = merge_dicts(definition, revision)

    # Save merged result
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"Merged JSON saved to {args.output}")

if __name__ == "__main__":
    main()