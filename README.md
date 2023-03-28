# file-system-node-js
A Node.js app that reads commands associated with creating, appending, deleting, and renaming files from a file and executes them.
The application watches a file named "command.txt" for changes, and every time a change happens, it will read the file's content and do what the user specified.

For instance, if a user writes "create a file text.txt" in the command.txt file and saves it, a file named file.txt will be created in the working directory. We could also specify absolute paths.
We have these available operations:
<li>creating a file</li>
<li>deleting a file</li>
<li>renaming a file</li>
<li>appending to a file </li>

<br>
And we should write the commands in the following formats in the command.txt file:
<li>create a file <path></li>
<li>delete the file <path></li>
<li>rename the file <path> to <new-path></li>
<li>add to the file <path> this content: <content></li>
<br>
Note that we can only have and execute one command in the command.txt file at a time.
