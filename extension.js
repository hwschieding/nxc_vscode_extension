const {ExtensionContext, commands, workspace, window, Uri} = require('vscode');
const EXTENSION_ID = 'nxchighlighter';
const COMPILER_PATH_SETTING = 'NXC.nbcCompilerPath';
const TERM_NAME = "NBC Compiler";

/**
 * @param {ExtensionContext} context
 */
async function activate(context) {

    let terminal = undefined;
    let nbcPath = await getCompilerPath(COMPILER_PATH_SETTING);

    const openNxcSettings = commands.registerCommand(`${EXTENSION_ID}.openNxcSettings`, function () {
        commands.executeCommand('workbench.action.openSettings', COMPILER_PATH_SETTING);
    });

    //Detect change in settings for NBC compiler path
    const onCompilerPathChange = workspace.onDidChangeConfiguration(async e => {
        if(e.affectsConfiguration(COMPILER_PATH_SETTING)){
            nbcPath = await getCompilerPath(COMPILER_PATH_SETTING);
        }
    });

    //Run compiler on current NXC file with download flag -- downloads to any NXT connected by USB (might change in the future)
    const compileAndDownload = commands.registerCommand(`${EXTENSION_ID}.compileAndDownload`, function () {
        terminal = getNBCTerminal(terminal);
        let activeEditor = window.activeTextEditor;
        if(activeEditor && activeEditor.document.languageId === 'nxc'){
            sendTextIfValidNbc(terminal, `'${nbcPath.uri.fsPath}' -S=usb -d '${activeEditor.document.fileName}'`, nbcPath.valid);
            terminal.show();
        } else{
            window.showErrorMessage("Editor must be open on a .nxc file")
        }
    });

    //Run compiler with help flag to ensure it's working
    const testCompiler = commands.registerCommand(`${EXTENSION_ID}.testCompiler`, function () {
        terminal = getNBCTerminal(terminal);
        sendTextIfValidNbc(terminal, `'${nbcPath.uri.fsPath}' -help`, nbcPath.valid);
        terminal.show();
    });

    context.subscriptions.push(
        onCompilerPathChange,
        testCompiler,
        compileAndDownload,
        openNxcSettings
    );
}

function sendTextIfValidNbc(term, text, valid){
    if(valid){
        term.sendText(text);
    } else{
        window.showErrorMessage(`No NBC compiler detected. [Change Path Setting](command:${EXTENSION_ID}.openNxcSettings)`);
    }
}

//Check if extension terminal already exists
function getNBCTerminal(terminal) {
    if(!terminal){
        return window.createTerminal(TERM_NAME);
    } else {
        return terminal
    }
}

//Find and return compiler at path specified in settings
async function getCompilerPath(section){
    const uri = Uri.file(workspace.getConfiguration().get(section));
    const fileExists = await isNbcPathReal(uri);
    if(fileExists){
        window.showInformationMessage('NBC compiler found!');
    } else {
        window.showWarningMessage(`NBC compiler not found at '${uri.fsPath}'. Consider changing the path: [Change Path Setting](command:${EXTENSION_ID}.openNxcSettings)`);
    }
    return {
        uri: uri,
        valid: fileExists
    }
}

async function isNbcPathReal(uri){
    try {
        const fileStat = await workspace.fs.stat(uri);
        if(fileStat.type !== 1 || !uri.fsPath.endsWith("nbc.exe")){
            return false;
        }
        return true;
    } catch {
        return false;
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}