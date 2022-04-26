import json


def parse(input_path, output_path):
    try:
        with open(input_path, 'r', errors='ignore') as infile:
            wordlist = infile.read().split('\n')

            # js_array = f"""wordlist = ['{"', '".join(filter(lambda x: len(x), wordlist))}'];"""
            js_array = f"""wordlist = {json.dumps(list(filter(lambda x: x, wordlist)), ensure_ascii = False)};"""

            with open(output_path, "r+") as f:
                f.truncate(0)
                f.write(js_array)

    except IOError:
        print('error opening file')


if __name__ == '__main__':
    parse('./wordlists/arabeyes.wordlist', './js/wordlist.js')
