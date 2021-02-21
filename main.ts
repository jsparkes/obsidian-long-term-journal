import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface LongTermJournalSettings {
	journalNote: string
	includeWeeks: boolean;
	yearFormat: string;
	monthFormat: string;
	weekFormat: string;
	dayFormat: string;
}

const DEFAULT_SETTINGS: LongTermJournalSettings = {
	journalNote: "journal.md",
	includeWeeks: true,
	yearFormat: "YYYY",
	monthFormat: "YYYY-MM MMM",
	weekFormat: "YYYY-MM-WW WWW",
	dayFormat: "YYYY-MM-DD DDD"
}

export default class LongTermJournal extends Plugin {
	settings: LongTermJournalSettings;

	async onload() {
		console.log('loading plugin');

		await this.loadSettings();

		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice!');
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addSettingTab(new LongTermJournalSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class LongTermJournalSettingTab extends PluginSettingTab {
	plugin: LongTermJournal;

	constructor(app: App, plugin: LongTermJournal) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Long Term Journal.'});

		new Setting(containerEl)
			.setName("Journal Note")
			.setDesc("Note that contains journal entries")
			.addText((text) =>
				text.setValue(this.plugin.settings.journalNote)
					.onChange(async (value) => {
						this.plugin.settings.journalNote = value
						await this.plugin.saveSettings()
					}));

		new Setting(containerEl)
			.setName("Year Format")
			.setDesc("")
			.addText((text) =>
				text.setValue(this.plugin.settings.yearFormat)
					.onChange(async (value) => {
						this.plugin.settings.yearFormat = value
						await this.plugin.saveSettings()
					}));
		
		new Setting(containerEl)
			.setName("Month Format")
			.setDesc("")
			.addText((text) =>
				text.setValue(this.plugin.settings.monthFormat)
					.onChange(async (value) => {
						this.plugin.settings.monthFormat = value
						await this.plugin.saveSettings()
					}));
		
		new Setting(containerEl)
			.setName("Week Format")
			.setDesc("")
			.addText((text) =>
				text.setValue(this.plugin.settings.weekFormat)
					.onChange(async (value) => {
						this.plugin.settings.weekFormat = value
						await this.plugin.saveSettings()
					}));

		new Setting(containerEl)
			.setName("Day Format")
			.setDesc("")
			.addText((text) =>
				text.setValue(this.plugin.settings.dayFormat)
					.onChange(async (value) => {
						this.plugin.settings.dayFormat = value
						await this.plugin.saveSettings()
					}));

		new Setting(containerEl).setName("Include weeks?").addToggle((toggle) => {
			toggle.setValue(this.plugin.settings.includeWeeks)
			toggle.onChange(async (value) => {
				this.plugin.settings.includeWeeks = value
				await this.plugin.saveSettings()
			})
		});
	}
}
