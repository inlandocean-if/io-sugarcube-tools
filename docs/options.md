## Options
Creates a list of radio buttons and a "next" button as a method for player choice inputs.

```
<<options [passage_name]>>
  [<<option option_text [passage_name]>>...]
  [<<optionif conditional option_text [passage_name]>>...]
  [<<optionhide conditional option_text [passage_name]>>...]
<</options>>
```

### Details:
Each child tag (`<<option>>`, `<<optionif>>`, `<<optionhide>>`) creates a radio button that changes the behavior of the "next" button. The "next" button will go to the passage specified by the selected option and execute any code in the associated child tag.

### Arguments:
`<<options>>` 
* `passage_name`: default passage the "next" button will link to. Necessary only in cases where all options may be hidden and/or unselectable.

`<<option>>`
* `option_text`: the text to be displayed.
* `passage_name`: the name of the passage this option corresponds with. Will be set to `option_text` if unsupplied.

`<<optionif>>`
* `conditional`: a valid conditional. If the conditional is false, this option will be unselectable.
* `option_text`: the text to be displayed.
* `passage_name`: the name of the passage this option corresponds with. Will be set to `option_text` if unsupplied.

`<<optionhide>>`
* `conditional`: a valid conditional. If the conditional is true, this option will be hidden.
* `option_text`: the text to be displayed.
* `passage_name`: the name of the passage this option corresponds with. Will be set to `option_text` if unsupplied.

## Additional notes:
The `<<options>>` macro is reliant on:
* The `_options_macro_selection` variable
* The following classes:
  * options_macro_choices
  * option_macro_next
  * options_macro_disabled

## Examples
```
Choose a companion for your journey:

<<options>>
    <<option "Dorothy" "kansas">><<set $companion to "Dorothy">>
    <<optionif $magic_powder "Jack Pumpkinhead" "yellow-brick-road">><<set $companion to "Jack">>
    <<optionhide `not $cursed` "Tip" "yellow-brick-road">><<set $companion to "Tip">>
    <<optionhide $cursed "Ozma" "emerald-city">><<set $companion to "Ozma">>
<</options>>
```