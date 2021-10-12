# Rubi and Furigana

This plugin adds a new command `Rubi` (can be found in `Edit` menu, Editor toolbar, or Keyboard Shortcut) that insert `<ruby>` tag into formatted text to display furigana.
	- It only works in markdown editor. The current WYSIWYG editor of Joplin is quite problematic, so I have no use for it at the moment.

## Usage:

Select text formatted similar to the ones below:

```
漢字「かんじ」
漢「かん」字「じ」
example(ɪɡˈzæmpl̩)
```

Activate the Rubi command by clicking on the menu item, the toolbar button, or the shortcut and turn them into something like this:

```
<ruby>漢字<rt>かんじ</rt></ruby>
<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
<ruby>example<rt>ɪɡˈzæmpl̩</rt></ruby>
```

which are displayed as the following:

<ruby>漢字<rt>かんじ</rt></ruby>
<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
<ruby>example<rt>ɪɡˈzæmpl̩</rt></ruby>

It is especially useful for Japanese (and East Asian languages in general), but it has its uses for many scenarios.

You can also select the rubi text and toggle it back to plain text using the same command.

The command is only activated when it found an equal number of open and close puntuations to reduce undesired situation.


## Settings

You can define which special characters will be turn into `<rt>` (Default: `([{（「『` ) and `</rt>` (Default: `)]}）」』`) in the plugin settings.

Shortcut (Default: `CmdOrCtrl+R`) can be changed in the shortcut editor.



