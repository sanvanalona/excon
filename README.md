# excon
EXtensive CONsole is a library that helps you distinguish between console.logs by making them different colors. The excon log comes with a stack trace that shows you what file/method called excon. 

## Usage
In the index.js file, at the bottom of the file, uncomment one of the lines to use excon. Uncomment `export let excon = new Excon(true,"note")` if you are working in react. Uncomment `let excon = new Excon(true,"console")` if you are working in regular javascipt/html.

In a React do `import {excon} from 'excon'`

After that you can run `excon.a_color_here(arguments_here)` to run an excon log. Example:` excon.red("Hi there everybody")`.
The colors are as follows:
- red
- blue
- navy 
- pink
- purple
- orange
- grey
- green
- fuchsia
- aqua
- teal

You can also hide different excon others by using `excon.hide("color_here","another_color_here")`. You can use window.exconHidden in the console to see an array of all of the hidden messages.

There is two other variables you can use inside the console.
- `window.exconQueue` - Shows an array of all of the messages made from excon
- `window.exconUsage` - Shows the count and the visiblity settings for all of the excon colors.

### Settings
In the new class for excon there are two different settings.
- The first is for if you want the call stack for each excon log. (True or False). (Currently disabled)
- The second is for displaying the number of hidden messages. There is 3 different settings. "note" for the hidden message dialog to show up in a notification. "console" to show up in the console. "off" to not show the hidden message dialog.

