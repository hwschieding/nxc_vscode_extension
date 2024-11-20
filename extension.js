const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    const TERM_NAME = "NBC Compiler";
    let nbcPath = vscode.Uri.file(vscode.workspace.getConfiguration().get("NXC.nbcCompilerPath"));
    console.log("Extension Running!");
    console.log(nbcPath);
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
        terminal.sendText(`'${nbcPath.fsPath}' -help`);
    }))
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

module.exports = {
    activate,
    deactivate
}