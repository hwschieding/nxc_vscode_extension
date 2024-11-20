const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    const COMPILER_PATH_SECTION = 'NXC.nbcCompilerPath';
    const TERM_NAME = "NBC Compiler";

    console.log("Extension Running!");

    let nbcUri = await getCompilerPath(COMPILER_PATH_SECTION);

    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(async e => {
        if(e.affectsConfiguration(COMPILER_PATH_SECTION)){
            const nbcPath = await getCompilerPath(COMPILER_PATH_SECTION);
            if(nbcPath.valid){
                nbcUri = nbcPath.uri;
            }
        }
    }))

    context.subscriptions.push(vscode.commands.registerCommand('nxchighlighter.helloworld', function () {
        vscode.window.showInformationMessage('Hello World from nxchighlighter!');
    }));

    context.subscriptions.push(vscode.commands.registerCommand('nxchighlighter.twoPlusTwo', function () {
        vscode.window.showInformationMessage((2 + 2).toString());
    }));

    context.subscriptions.push(vscode.commands.registerCommand('nxchighlighter.openTerminal', function () {
        const terminal = getNBCTerminal(TERM_NAME);
        terminal.sendText("echo 'Terminal Test Message'");
        terminal.show();
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('nxchighlighter.testCompiler', function () {
        const terminal = getNBCTerminal(TERM_NAME);
        terminal.sendText(`'${nbcUri.fsPath}' -help`);
    }));
}

function deactivate() {}

function getNBCTerminal(terminalName) {
    const terminals = vscode.window.terminals;
    for(let i = 0; i < terminals.length; i++){
        if(terminals[i].name == terminalName){
            return terminals[i];
        }
    }
    return createNBCTerminal(terminalName);
}

function createNBCTerminal(name){
    return vscode.window.createTerminal(name);
}

async function getCompilerPath(section){
    uri = vscode.Uri.file(vscode.workspace.getConfiguration().get(section));
    const fileExists = await isFileReal(uri);
    if(fileExists){
        console.log("Compiler Found");
        vscode.window.showInformationMessage('NBC compiler found!');
    } else {
        console.log("Compiler Not Found");
        vscode.window.showInformationMessage(`NBC compiler not found at '${uri.fsPath}'.\n New line test`);
    }
    return {
        uri: uri,
        valid: fileExists
    }
}

async function isFileReal(uri){
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    } catch {
        return false;
    }
}

module.exports = {
    activate,
    deactivate
}