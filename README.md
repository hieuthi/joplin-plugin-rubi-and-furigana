# Rubi and Furigana

This plugin adds a new command `Rubi` (can be found in `Edit` menu, Editor toolbar, or Keyboard Shortcut) that insert appropriate `<ruby>` and `<rt>` tags into formatted text to display furigana and vice versa.

It is especially useful for Japanese (and East Asian languages in general), but it has its uses for many scenarios.

It only works in markdown editor. The current WYSIWYG editor of Joplin is quite problematic, so I have no use for it at the moment.

## Usage:

The current version of the plugin supports two methods for converting: Basic, and Search and Replace.

### Rubi (Basic) (Shortcut: `CmdOrCtrl+R`)

The `Basic` logic will add `<ruby>` tags around the seclection

```
漢字「かんじ」 → <ruby>漢字<rt>かんじ</rt></ruby>
漢「かん」字「じ」 → <ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
example(ɪɡˈzæmpl̩) → <ruby>example<rt>ɪɡˈzæmpl̩</rt></ruby>
```

which are displayed as the following:

<ruby>漢字<rt>かんじ</rt></ruby>
<ruby>漢<rt>かん</rt>字<rt>じ</rt></ruby>
<ruby>example<rt>ɪɡˈzæmpl̩</rt></ruby>

The `Basic` logic will only be activated when there are an equal number of open and close characters.

### Rubi (Search and Replace) (Shortcut: `CmdOrCtrl+Shift+R`)

The `Basic` logic is fine in most case but it is inconvenient to select each term seperately if you have to insert many furigana amid a paragraph. In that case you can use `Search and Replace` logic which simply convert designated characters to approriate tags.

```
{今日(きょう)}は{漢字(かんじ)}の{書き取(かきと)}りがある 
→ <ruby>今日<rt>きょう</rt></ruby>は<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>書き取<rt>かきと</rt></ruby>りがある

```

which are displayed as the following:

<ruby>今日<rt>きょう</rt></ruby>は<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>書き取<rt>かきと</rt></ruby>りがある

It is not pretty but it allows us to keep typing instead of constantly switch back and forth between keyboard and mouse to toggle ruby characters.


## Settings

You can define which characters will be turn into `<ruby>` (Default: `{『`), `</ruby>` (Default: `}』`), `<rt>` (Default: `([（「`), and `</rt>` (Default: `)]）」`) in the plugin settings.

There is only one Rubi button in the editor toolbar but you can set which logic it uses in plugin settings.

Keyboard Shortcuts can be changed in the shortcut editor.



