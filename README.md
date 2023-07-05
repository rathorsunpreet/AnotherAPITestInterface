# Another API Test Interface

Another API Test Interface is, the successor of [Simple API Test Interface](https://github.com/rathorsunpreet/SimpleAPITestInterface), an API Test Interface which uses command-line arguments or format-specific JSON files supplied during the execution to perform certain actions.

This interface allows users:
- to create multiple test suites or singular test cases
- execution of all test suites or a single suite
- report generation of the executed suite(s)

The API used in this project is [Reqres.in](https://reqres.in/).

## Installation

Download the package from [Github](https://github.com/rathorsunpreet/AnotherAPITestInterface) and unzip it.

```console
# Installs dependencies
npm install

# If the above does not work, then
npm install --only=dev
```

## Usage
The project allows for the following commands to be used:

- env - Sets the environment to use
- site - Sets the site to use
- token - Sets the authorization token to use
- display - Displays the non-commands lists/objects used
- excludefiles - Comma-separated list of suite(s) to exclude during execution
- runner - Sets the Node Runner to use
- templatename - Sets the template to load
- templatedir - Sets the location of templates
- suitedir - Sets the location of test case(s) or suite(s)
- datafile - Sets the location of user-defined data
- currentsuitelist - List of test suites to execute, used inside templates
- help - Show this message
- list - Display the list of valid test suite(s) or case(s)
- report - Generate a HTML Report upon execution of test suite(s) or case(s)
- savetemplate - Save the current arguments in a JSON template
 
```node
# To view the help message
npm run test help

# To view the list of available suites
npm run test list

# To execute test suite(s)
npm run test users registration

# To generate HTML report
npm run test users report registration
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
