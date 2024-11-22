import json

def make_entry(f, name, description):
    print(f"{name}, {description}")
    snippet = {
        "prefix":name,
        "body":name,
        "description":description
    }
    snippet_json = f"\"{name}\":" + json.dumps(snippet) + ",\n"
    print(snippet_json)
    f.write(snippet_json)


if __name__ == "__main__":
    with open("dev_scripts/snippet_writer_output.txt", "a") as f:
        running = True
        while running:
            snippet_name = input("Snippet name:")
            snippet_description = input(f"\"{snippet_name}\" description:")
            make_entry(f, snippet_name, snippet_description)
            if not input("Leave blank to continue") == "":
                running = False