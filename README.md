# Another API Test Interface

Another API Test Interface is, the successor of [Simple API Test Interface](https://github.com/rathorsunpreet/SimpleAPITestInterface), an API Test Interface which uses command-line arguments or format-specific JSON files supplied during the execution to perform certain actions.

This interface allows users:
- to create multiple test suites or singular test cases
- execution of all test suites or a single suite
- report generation of the executed suite(s)
- ease of execution of complex commands or a lengthy command via the use of templates
- ability to change directories/folders of necessary components like location of test suite(s)
- automatic update of available test suite(s)
- creation of templates made easy by the use of command 'savetemplate'

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
- env=site - Compund command which excutes 'env' and 'site' commands together

The keyword 'all' can be used to signal the inclusion of all test suite(s) / case(s). 'all' is considered invalid when used with 'excludefiles' command.
 
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
## Templates
Templates are commmand line arguments saved in a JSON file. The structure of a template is as follows:
```Javascript
{
  commands: {
    all commands here such as 
    env: prod,
    excludefiles: [
      file1,
      file2
    ]
  },
  currentsuitelist: [
    all suite(s) / case(s) names here such as
    file1,
    file2
  ]
}
```
For the commands that do not take a value such as 'report', simply use the following method to write it under 'commands' object:
```Javascript
  report: true
```
A false value is simply ignored.

If a template name is provided along with command-line arguments, then the preference is given to command-line arguments. This means that command-line arguments are executed and if a template equivalent is present then that is simply skipped.

## License

[MIT](https://choosealicense.com/licenses/mit/)
