import joplin from 'api';
import { MenuItemLocation } from 'api/types';
import { ToolbarButtonLocation } from 'api/types';
import { SettingItemType } from 'api/types';


function toggleSelectionWithRubi(selected: string|null, rubiOpens = '([{（「『', rubiCloses=')]}）」』'){
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

		ret = ret.replace(/<rt>/g, rubiOpens[0])
		ret = ret.replace(/<\/rt>/g, rubiCloses[0])
	} else {
		// Add ruby tag
		ret = '<ruby>'
		for (let i = 0; i < core.length; i++) {
			const c = core[i];
			if (rubiOpens.indexOf(c) > -1){
				ret += '<rt>';
				nOpens += 1
				continue;
			}
			if (rubiCloses.indexOf(c) > -1){
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

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('settings.rubiFurigana', {
			label: 'Rubi and Furigana',
			iconName: 'fab fa-sketch'
		});

		await joplin.settings.registerSettings({
			'rubi_opens': {
				value: "([{（「『",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Open puntuations',
				description: 'Characters that will be replaced with <rt>. The first puntuation will be used when convert rubi back to text.'
			},
			'rubi_closes': {
				value: ")]}）」』",
				type: SettingItemType.String,
				section: 'settings.rubiFurigana',
				public: true,
				label: 'Close puntuations',
				description: 'Characters that will be replaced with </rt>. The first puntuation will be used when convert rubi back to text.'
			}
		});

		joplin.commands.register({
			name : 'toggleRubi',
			label: 'Rubi',
			enabledCondition: 'markdownEditorPaneVisible',
			iconName: 'fab fa-sketch',
			execute: async () => {
				const rubiOpens  = await joplin.settings.value('rubi_opens') as string;
				const rubiCloses = await joplin.settings.value('rubi_closes') as string;

				const selectedText = await joplin.commands.execute('selectedText') as string;

				const newText = toggleSelectionWithRubi(selectedText,rubiOpens,rubiCloses);
				
				await joplin.commands.execute('replaceSelection', newText);
				await joplin.commands.execute('editor.focus');
			}
		});

		joplin.views.toolbarButtons.create('toggleRubiButton', 'toggleRubi', ToolbarButtonLocation.EditorToolbar);
		joplin.views.menuItems.create('toggleRubiMenuItem', 'toggleRubi', MenuItemLocation.Edit, { accelerator: 'CmdOrCtrl+R' });
		
	},
});
