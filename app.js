const fsPromise = require("fs/promises");
const filePath = 'command.txt';

// create a file function
async function createFile(path) {
    try {
        // we will check that file already exists...
        const existingFileHandler = await fsPromise.open(path, "r");
        existingFileHandler.close();

        return console.log(`Oops ! this ${path} file already exists in the curent directory.`);
    } catch (error) {
        // we don't have the file, now we should create it
        const newFileHandle = await fsPromise.open(path, "w");
        console.log("A new file was successfully created.");
        newFileHandle.close();

    }
}


// Delete a file
async function deleteFile(path) {
    try {
        await fsPromise.unlink(path);
        console.log("The file was successfully removed.");
        return;
    } catch (error) {
        if (error.code === "ENOENT") {
            console.log(`Oops! ${path} does not exists.`);
        } else {
            console.log(error.message);
        }
    }
}


// rename file the existing file
async function renameFile(oldFilePath, newFilePath) {
    try {
        await fsPromise.rename(oldFilePath, newFilePath);
        console.log(`${oldFilePath} file has been successfully has been renamed to ${newFilePath}.`);
    } catch (error) {
        if (error.type === "ENOENT") {
            console.log(`Oops! ${path} does not exists.`);
        } else {
            console.log('Some error has been occured while doing operation...');
            console.log(error.message);
        }
    }
}

let addedContent=null;

// write new content to the given file
async function addTextToFile(filePath,newText){
    if(addedContent===newText) return ;
    try {
        const fileHandler = await fsPromise.open(filePath,"a");
        fileHandler.write(newText);
        addedContent = newText;
        console.log(`New content has been added to the ${filePath} file`);
    } catch (error) {
        console.log(error.message);
    }
}


(async () => {

    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete the file";
    const RENAME_FILE = "rename the file";
    const ADD_TO_FILE = "add to the file";

    const commandFileHandler = await fsPromise.open(filePath, "r");

    commandFileHandler.on("change", async () => {
        const fileSize = (await commandFileHandler.stat()).size;

        const buffer = Buffer.alloc(fileSize);
        const offset = 0;
        const length = fileSize;
        const position = 0;

        await commandFileHandler.read(buffer, offset, length, position);

        const content = await buffer.toString("utf-8");

        if (content.includes(CREATE_FILE)) {
            const newfileName = content.substring(CREATE_FILE.length + 1);
            createFile(newfileName);
        }

        if (content.includes(DELETE_FILE)) {
            const filePath = content.substring(DELETE_FILE.length + 1);
            deleteFile(filePath);
        }

        if (content.includes(RENAME_FILE)) {
            const _idx = content.indexOf(" to ");
            const oldFilePath = content.substring(RENAME_FILE.length + 1, _idx);
            const newFilePath = content.substring(_idx + 4);
            renameFile(oldFilePath, newFilePath);
        }

        if (content.includes(ADD_TO_FILE)) {
            const _idx = content.indexOf(" this content: ");
            const filePath = content.substring(ADD_TO_FILE.length + 1, _idx);
            const newText = content.substring(_idx + 15);
            addTextToFile(filePath,newText);
        }
    })


    // It's keep on checking for the changes on the file that you have provided it.
    let watcher = await fsPromise.watch(filePath);

    for await (let events of watcher) {
        if (events.eventType === "change") {
            commandFileHandler.emit("change");
        }
    }

})();