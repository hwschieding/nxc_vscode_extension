import json
ignored_keywords = ["unsigned"]

def make_entry(f, name, description):
    print(f"{name}, {description}")
    snippet = {
        "prefix":f"{name}",
        "body":f"{name}",
        "description":description
    }
    snippet_json = f"\"{name}\":" + json.dumps(snippet, indent=None) + ",\n"
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
                name_index = 1
                for word in line_words:
                    if word in ignored_keywords:
                        name_index += 1
                    else:
                        break
                make_entry(output_f, line_words[name_index], ' '.join(line_words).strip("\n "))

if __name__ == "__main__":
    automatic_entries()