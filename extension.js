const {ExtensionContext, commands, workspace, window, Uri} = require('vscode');

/**
 * @param {ExtensionContext} context
 */

async function activate(context) {
    const EXTENSION_ID = 'nxchighlighter';
    const COMPILER_PATH_SECTION = 'NXC.nbcCompilerPath';
    const TERM_NAME = "NBC Compiler";

    console.log("Extension Running!");

    let nbcUri = (await getCompilerPath(COMPILER_PATH_SECTION)).uri;

    const openNxcSettings = commands.registerCommand(`${EXTENSION_ID}.openNxcSettings`, function () {
        commands.executeCommand('workbench.action.openSettings', COMPILER_PATH_SECTION);
    });

    const onCompilerPathChange = workspace.onDidChangeConfiguration(async e => {
        if(e.affectsConfiguration(COMPILER_PATH_SECTION)){
            const nbcPath = await getCompilerPath(COMPILER_PATH_SECTION);
            if(nbcPath.valid){
                nbcUri = nbcPath.uri;
            }
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
        terminal.sendText(`'${nbcUri.fsPath}' -d '${currentFile}'`);
        terminal.show();
    })

    const openTerminal = commands.registerCommand(`${EXTENSION_ID}.openTerminal`, function () {
        const terminal = getNBCTerminal(TERM_NAME);
        terminal.sendText("echo 'Terminal Test Message'");
        terminal.show();
    });
    
    const testCompiler = commands.registerCommand(`${EXTENSION_ID}.testCompiler`, function () {
        const terminal = getNBCTerminal(TERM_NAME);
        terminal.sendText(`'${nbcUri.fsPath}' -help`);
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
        console.log("Compiler Found");
        window.showInformationMessage('NBC compiler found!');
    } else {
        console.log("Compiler Not Found");
        window.showWarningMessage(`NBC compiler not found at '${uri.fsPath}'. Consider changing the path: [vscode://settings/${section}](command:nxchighlighter.openNxcSettings)`);
    }
    return {
        uri: uri,
        valid: fileExists
    }
}

async function isFileReal(uri){
    try {
        await workspace.fs.stat(uri);
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