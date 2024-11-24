import json

def make_entry(f, name, description):
    print(f"{name}, {description}")
    snippet = {
        "prefix":f"{name}()",
        "body":f"{name}($1)$0",
        "description":description
    }
    snippet_json = f"\"{name}\":" + json.dumps(snippet, indent=4) + ",\n"
    print(snippet_json)
    f.write(snippet_json)

def manual_entries():
      with open("dev_scripts/snippet_writer_output.txt", "a") as f:
        running = True
        while running:
            snippet_name = input("Snippet name:")
            snippet_description = input(f"\"{snippet_name}\" description:")
            make_entry(f, snippet_name, snippet_description)
            if not input("Leave blank to continue") == "":
                running = False

def automatic_entries():
    with open("dev_scripts/doc_input.txt", "r") as input_f, open("dev_scripts/snippet_writer_output.txt", "a") as output_f:
        input_lines = input_f.readlines()
        for line in input_lines:
            line = line.strip(" ")
            if line[0] == "â":
                line_words = line.split(" ")
                line_words.pop(0)
                make_entry(output_f, line_words[1], ' '.join(line_words).strip("\n "))

if __name__ == "__main__":
    automatic_entries()