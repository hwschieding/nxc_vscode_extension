const {ExtensionContext, commands, workspace, window, Uri} = require('vscode');
const EXTENSION_ID = 'nxchighlighter';
const COMPILER_PATH_SECTION = 'NXC.nbcCompilerPath';
const TERM_NAME = "NBC Compiler";

/**
 * @param {ExtensionContext} context
 */

async function activate(context) {

    console.log("Extension Running!");

    let nbcPath = await getCompilerPath(COMPILER_PATH_SECTION);

    const openNxcSettings = commands.registerCommand(`${EXTENSION_ID}.openNxcSettings`, function () {
        commands.executeCommand('workbench.action.openSettings', COMPILER_PATH_SECTION);
    });

    const onCompilerPathChange = workspace.onDidChangeConfiguration(async e => {
        if(e.affectsConfiguration(COMPILER_PATH_SECTION)){
            nbcPath = await getCompilerPath(COMPILER_PATH_SECTION);
        }
    });

    const helloWorld = commands.registerCommand(`${EXTENSION_ID}.helloworld`, function () {
        window.showInformationMessage('Hello World from nxchighlighter!');
    });

    const twoPlusTwo = commands.registerCommand(`${EXTENSION_ID}.twoPlusTwo`, function () {
        window.showInformationMessage((2 + 2).toString());
    });

    const compileAndDownload = commands.registerCommand(`${EXTENSION_ID}.compileAndDownload`, function () {
        const terminal = getNBCTerminal(TERM_NAME);
        let currentFile = window.activeTextEditor.document.fileName;
        sendTextIfValidNbc(terminal, `'${nbcPath.uri.fsPath}' -d '${currentFile}'`, nbcPath.valid);
        //terminal.sendText(`'${nbcPath.uri.fsPath}' -d '${currentFile}'`);
        terminal.show();
    })

    const openTerminal = commands.registerCommand(`${EXTENSION_ID}.openTerminal`, function () {
        const terminal = getNBCTerminal(TERM_NAME);
        terminal.sendText("echo 'Terminal Test Message'");
        terminal.show();
    });
    
    const testCompiler = commands.registerCommand(`${EXTENSION_ID}.testCompiler`, function () {
        const terminal = getNBCTerminal(TERM_NAME);
        sendTextIfValidNbc(terminal, `'${nbcPath.uri.fsPath}' -help`, nbcPath.valid);
        //terminal.sendText(`'${nbcPath.uri.fsPath}' -help`);
        terminal.show();
    });

    context.subscriptions.push(
        onCompilerPathChange, 
        helloWorld, 
        twoPlusTwo, 
        openTerminal, 
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

function getNBCTerminal(terminalName) {
    const terminals = window.terminals;
    for(let i = 0; i < terminals.length; i++){
        if(terminals[i].name == terminalName){
            return terminals[i];
        }
    }
    return window.createTerminal(terminalName);
}

async function getCompilerPath(section){
    uri = Uri.file(workspace.getConfiguration().get(section));
    const fileExists = await isFileReal(uri);
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

async function isFileReal(uri){
    try {
        const fileStat = await workspace.fs.stat(uri);
        console.log("test 1 passed");
        if(fileStat.type !== 1){
            return false;
        }
        console.log("test 2 passed");
        if(!uri.fsPath.endsWith("nbc.exe")){
            return false;
        }
        console.log("test 3 passed");
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