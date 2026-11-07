Macro.add("options", {
        skipArgs : false,
        tags     : ["option", "optionif", "optionhide"],
        handler  : function() {
            // Possible TODOs: support for multiple options on same passage
            // TODO: allow passage and label to be the same
            let buttons = [];
            let switch_cases = [];
            let has_checked = false;
            let default_passage = false;
            let elig_btn = false;

            if (this.payload[0].args.length > 0) {
                default_passage = this.payload[0].args[0];
            }

            for (var i = 1; i < this.payload.length; i++) {
                let disabled = false;
                let text, contents, passage;
                if (this.payload[i].name === "optionif") {
                    if (this.payload[i].args.length < 2) throw new Error(`<<optionif>> missing parameters`);
                    try {
                        disabled = !Scripting.evalJavaScript(this.payload[i].args[0]);
                    } catch (err) {
                        throw new Error(`<<optionif>> has bad conditional "${this.payload[i][0]}"`);
                    }
                    text = this.payload[i].args[1];
                    passage = (this.payload[i].args.length == 2) ? this.payload[i].args[1] : this.payload[i].args[2];
                    contents = this.payload[i].contents;
                } else if (this.payload[i].name === "optionhide") {
                    if (this.payload[i].args.length < 2) throw new Error(`<<optionhide>> missing parameters`);
                    try {
                        if(Scripting.evalJavaScript(this.payload[i].args[0])) {
                            continue;
                        }
                    } catch (err) {
                        throw new Error(`<<optionhide>> has bad conditional "${this.payload[i][0]}"`);
                    }
                    text = this.payload[i].args[1]
                    passage = (this.payload[i].args.length == 2) ? this.payload[i].args[1] : this.payload[i].args[2];
                    contents = this.payload[i].contents;
                } else {
                    if (this.payload[i].args.length < 1) throw new Error(`<<option>> missing parameters`);
                    text = this.payload[i].args[0];
                    passage = (this.payload[i].args.length == 1) ? this.payload[i].args[0] : this.payload[i].args[1];
                    contents = this.payload[i].contents;
                }
                let checked = "";
                if (!has_checked & !disabled) {
                    checked = " checked";
                    has_checked = true;
                    elig_btn = true;
                }

                switch_cases.push(
                    `<<case ${i}>>${contents}<<goto "${passage}">>`
                )
                let disabled_text = disabled ? " class=options_macro_disabled" : "";
                buttons.push(
                    `<div>` + 
                    `<label${disabled_text}><<radiobutton "_options_macro_selection" ${i}${checked}>> ${text}</label>` +
                    "</div>"
                )
            }
            if (!(default_passage || elig_btn)) throw new Error("no valid choices and default passage unset.");
            let final_output = ("<div class=\"options_macro_choices\">" +
                buttons.join("") + "</div>" +
                `<div class=\"options_macro_next\"><<button "Next">><<switch _options_macro_selection>>` +
                switch_cases.join("") +
                ((default_passage) ? `<<default>><<goto ${default_passage}>>`:"") +
                `<</switch>><</button>></div>`)
            jQuery(this.output).wiki(final_output)
        }
    }
)

// for use with the <<options>> macro
$(document).on(':passagedisplay', function (ev) {
    for (let to_disable of document.getElementsByClassName("options_macro_disabled")) {
        to_disable.getElementsByClassName("macro-radiobutton")[0].disabled = true;
    }
});