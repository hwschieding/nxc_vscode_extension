const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log("Extension Running!");
    const disposable = vscode.commands.registerCommand('nxchighlighter.helloworld', function () {
        vscode.window.showInformationMessage('Hello World from nxchighlighter!');
    });
    const disposableTwo = vscode.commands.registerCommand('nxchighlighter.twoPlusTwo', function () {
        vscode.window.showInformationMessage((2 + 2).toString());
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}