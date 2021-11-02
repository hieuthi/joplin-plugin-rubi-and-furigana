import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { ToolbarButtonLocation } from 'api/types';
import { SettingItemType } from 'api/types';


function toggleSelectionWithRubiBasic(selected: string|null, 
										rto = '([（「', rtc=')]）」'){
	if (!selected) selected = '';

	// Remove white space on either side of selection
	const start = selected.search(/[^\s]/);
	const end   = selected.search(/[^\s](?=[\s]*$)/);
	const core  = selected.substr(start, end - start + 1);

	let nOpens  = 0
	let nCloses = 0

	let ret = ''

	if (core.startsWith('<ruby>') && core.endsWith('<\/ruby>')) {
		// Remove ruby tag
		ret = core.slice(6, core.length-7)

		nOpens  = (ret.match(/<rt>/g) || []).length;
		nCloses = (ret.match(/<\/rt>/g) || []).length;

		ret = ret.replace(/<rt>/g, rto[0])
		ret = ret.replace(/<\/rt>/g, rtc[0])
	} else {
		// Add ruby tag
		ret = '<ruby>'
		for (let i = 0; i < core.length; i++) {
			const c = core[i];
			if (rto.indexOf(c) > -1){
				ret += '<rt>';
				nOpens += 1
				continue;
			}
			if (rtc.indexOf(c) > -1){
				ret += '</rt>';
				nCloses += 1
				continue;
			}
			ret += c
		}
		ret += '</ruby>';
	}

	if (nOpens > 0 && nOpens == nCloses){
		return selected.substr(0, start) + ret + selected.substr(end + 1);
	} else {
		return selected;
	}
}

function toggleSelectionWithRubiSnR(selected: string|null, 
									rto = '([（「', rtc=')]）」',
									ruo = '{『', ruc = '}』'){
	if (!selected) selected = '';
	if (ruo.length==0 || ruc.length==0 || rto.length==0 || rtc.length==0) {return selected;}

	let ret = '';
	if (selected.search('<ruby>')>0 || selected.search('</ruby>')>0 
		|| selected.search('<rt>')>0 || selected.search('</rt>')>0) {
		ret = selected.replace(/<ruby>/g, ruo[0]);
		ret = ret.replace(/<\/ruby>/g, ruc[0]);
		ret = ret.replace(/<rt>/g, rto[0]);
		ret = ret.replace(/<\/rt>/g, rtc[0]);
	} else {
		for (let i = 0; i < selected.length; i++) {
			const c = selected[i];
			if (ruo.indexOf(c) > -1){
				ret += '<ruby>';
				continue;
			}
			if (ruc.indexOf(c) > -1){
				ret += '</ruby>';
				continue;
			}
			if (rto.indexOf(c) > -1){
				ret += '<rt>';
				continue;
			}
			if (rtc.indexOf(c) > -1){
				ret += '</rt>';
				continue;
			}
			ret += c;
		}
	}
	return ret;
}

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('settings.rubiFurigana', {
			label: 'Rubi and Furigana',
			iconName: 'fab fa-sketch'
		});

		await joplin.settings.registerSettings({
			'rubi_default': {
				value: 0,
				type: SettingItemType.Int,
				isEnum: true,
				options: {0: "Rubi (Basic)", 1: "Rubi (Search and Replace)"},
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Default Rubi Command (Restart required)',
				description: 'The default command that will be included in editor toolbar.'
			},
			'rubi_rto': {
				value: "([（「",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Placeholders for <rt> (All commands)',
				description: 'Characters that will be replaced with <rt>. The first character will be used when converting rubi back to text.'
			},
			'rubi_rtc': {
				value: ")]）」",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Placeholders for </rt> (All commands)',
				description: 'Characters that will be replaced with </rt>. The first character will be used when converting rubi back to text.'
			},
			'rubi_ruo': {
				value: "{『",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Placeholders for <ruby> (Seach and Replace)',
				description: 'Characters that will be replaced with <ruby>. The first character will be used when converting rubi back to text.'
			},
			'rubi_ruc': {
				value: "}』",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Placeholders for </ruby> (Seach and Replace)',
				description: 'Characters that will be replaced with </ruby>. The first character will be used when converting rubi back to text.'
			},
		});

		joplin.commands.register({
			name : 'toggleRubiBasic',
			label: 'Rubi (Basic)',
			enabledCondition: 'markdownEditorPaneVisible',
			iconName: 'fab fa-sketch',
			execute: async () => {
				const rto  = await joplin.settings.value('rubi_rto') as string;
				const rtc = await joplin.settings.value('rubi_rtc') as string;

				const selectedText = await joplin.commands.execute('selectedText') as string;

				const newText = toggleSelectionWithRubiBasic(selectedText,rto,rtc);
				
				await joplin.commands.execute('editor.execCommand', {name: "replaceSelection", args: [newText, "around"]});
				await joplin.commands.execute('editor.focus');
			}
		});

		joplin.commands.register({
			name : 'toggleRubiSnR',
			label: 'Rubi (Search and Replace)',
			enabledCondition: 'markdownEditorPaneVisible',
			iconName: 'fab fa-sketch',
			execute: async () => {
				const ruo = await joplin.settings.value('rubi_ruo') as string;
				const ruc = await joplin.settings.value('rubi_ruc') as string;
				const rto = await joplin.settings.value('rubi_rto') as string;
				const rtc = await joplin.settings.value('rubi_rtc') as string;

				const selectedText = await joplin.commands.execute('selectedText') as string;

				const newText = toggleSelectionWithRubiSnR(selectedText,rto,rtc,ruo,ruc);
				
				await joplin.commands.execute('editor.execCommand', {name: "replaceSelection", args: [newText, "around"]});
				await joplin.commands.execute('editor.focus');
			}
		});

		joplin.views.menuItems.create('toggleRubiBasicMenuItem', 'toggleRubiBasic', MenuItemLocation.Edit, { accelerator: 'CmdOrCtrl+R' });
		joplin.views.menuItems.create('toggleRubiSnRMenuItem', 'toggleRubiSnR', MenuItemLocation.Edit, { accelerator: 'CmdOrCtrl+Shift+R' });

		const defcmd = await joplin.settings.value("rubi_default") as number;
		if (defcmd==0){
			joplin.views.toolbarButtons.create('toggleRubiButton', 'toggleRubiBasic', ToolbarButtonLocation.EditorToolbar);
		} else {
			joplin.views.toolbarButtons.create('toggleRubiButton', 'toggleRubiSnR', ToolbarButtonLocation.EditorToolbar);
		}

	},
});
