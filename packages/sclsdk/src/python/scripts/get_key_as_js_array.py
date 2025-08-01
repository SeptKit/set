import json
import argparse

def main():
    parser = argparse.ArgumentParser(description="Generate a JS array of all top-level keys from a JSON file.")
    parser.add_argument('--input', required=True, help='Path to the input JSON file')
    parser.add_argument('--output', required=True, help='Path to the output JS file')
    parser.add_argument('--var', default='keys', help='Name of the JS array variable')
    args = parser.parse_args()

    with open(args.input, 'r', encoding='utf-8') as f:
        data = json.load(f)

    keys = list(data.keys())

    js_array = f"export const {args.var} = [\n" + ",\n".join(f'  "{k}"' for k in keys) + "\n];\n"

    with open(args.output, 'w', encoding='utf-8') as f:
        f.write(js_array)

    print(f"JS array written to {args.output}")

if __name__ == "__main__":
    main()