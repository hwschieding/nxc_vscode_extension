
def reformat(start_line):
    with open("./snippets/nxc.snippets.json", "r") as f_input, open("dev_scripts/reformat_output.json", "w") as f_output:
        input_lines = f_input.readlines()
        print(len(input_lines))
        i = start_line
        while i < len(input_lines) - 5:
            line_set = input_lines[i:i+5]
            formatted_line = ""
            for line in line_set:
                formatted_line = formatted_line + line.strip("\n\t ")
            print(formatted_line)
            f_output.write(f"{formatted_line}\n")
            i += 5

if __name__ == "__main__":
    reformat(150)