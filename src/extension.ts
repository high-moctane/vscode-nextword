import * as vscode from 'vscode';
import * as child_process from 'child_process';

class Nextword {
	available: boolean; // on error, available will be false.
	candidateNum: number;
	inputTrimLen: number;

	constructor() {
		this.available = true;
		this.inputTrimLen = 1000;
		this.candidateNum = 5;
	}

	// provider provides completion items.
	provider(): vscode.Disposable {
		let prov = this;
		return vscode.languages.registerCompletionItemProvider(
			'*',
			{
				provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
					if (!prov.available) {
						return new vscode.CompletionList([], false);
					}

					let input = document
						.getText(new vscode.Range(new vscode.Position(Math.max(0, position.line - 4), 0), position))
						.replace(/\s/g, " ")
						.slice(-prov.inputTrimLen);

					var output = "";
					try {
						output = child_process.execSync("nextword", { input: input }).toString();
					} catch (e) {
						console.log("nextword error:", e);
						vscode.window.showErrorMessage("nextword error:" + String(e));
						prov.available = false;
						return new vscode.CompletionList([], false);
					}

					if (output === "\n") {
						return new vscode.CompletionList([], false);
					}

					const res = output
						.trim()
						.split(" ")
						.slice(0, prov.candidateNum)
						.map(word => new vscode.CompletionItem(word, vscode.CompletionItemKind.Text));

					return res;
				}
			},
			"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
			"N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
			"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
			"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
			" ",
		);
	}

}

export function activate(context: vscode.ExtensionContext) {
	let nextword = new Nextword();
	context.subscriptions.push(nextword.provider());
}
