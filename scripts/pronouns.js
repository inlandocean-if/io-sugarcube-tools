window.PronounSet = class PronounSet {
    /**
     * Class for quick & easy creation of pronoun sets.
     * 
     * @param {Array|string} pronouns: either "m", "f", or "o" for he/him, she/her, they/them respectively. Otherwise an array in the format of ["set name", plural verbs (bool), "they", "them", "their", "theirs", "themself"].
     */
    constructor(pronouns) {
        if (Array.isArray(pronouns)) {
            var list = pronouns.slice(3);
            this.name = pronouns[0];
            this.plural = pronouns[1];
            this.gender_terms = pronouns[2];
        } else {
            switch(pronouns) {
                case "m":
                    var list = ["he", "him", "his", "his", "himself"]
                    this.plural = false;
                    this.gender_terms = "m";
                    this.name = "he/him"
                    break;
                case "f":
                    var list = ["she", "her", "her", "hers", "herself"]
                    this.plural = false;
                    this.gender_terms = "f";
                    this.name = "she/her"
                    break;
                case "o":
                    var list = ["they", "them", "their", "theirs", "themself"]
                    this.plural = true;
                    this.gender_terms = "o";
                    this.name = "they/them"
                    break;
            }
        }
        let they_vars = ["they", "them", "their", "theirs", "themself"];
        for (let i = 0; i < they_vars.length; i++) {
            eval(`this.${they_vars[i]}=list[${i}]`)
            eval(`this.${they_vars[i].toUpperFirst()}=list[${i}].toUpperFirst()`)
        }
        this.theyre = this.they + (this.plural ? "'re" : "'s"); 
        this.Theyre = this.theyre.toUpperFirst();

        this.__constructGenderedTerms()
    }

    clone () {
        return new this.constructor(
            [this.name, this.plural, this.gender_terms, this.they, this.them, this.their, this.theirs, this.themself]
        )
    }

    toJSON() {
        var ownData = {};
		Object.keys(this).forEach(function (pn) { ownData[pn] = clone(this[pn]); }, this);
		return Serial.createReviver(String.format(
			"new {0}({1})",
			this.constructor.name,
			[this.name, this.plural, this.gender_terms, this.they, this.them, this.their, this.theirs, this.themself]
		));
    }

    addGenderedTerm(neutral, masc, fem, getter=false) {
        getter = getter ? getter : neutral
        switch (this.gender_terms) {
            case "m": eval(`this.${getter} = masc`); break;
            case "f": eval(`this.${getter} = fem`); break;
            case "o": eval(`this.${getter} = neutral`); break;
        }
    }

    // Seperated for readability
    __constructGenderedTerms() {
        this.addGenderedTerm("person", "man", "woman");
    }
}

Macro.add("verb", {
    skipargs : false,
    handler : function() {
        let args = this.args
        if (args.length == 2) { 
            // defaults to using $plural_verbs, which is assumed to hold information for MC's pronouncs
            jQuery(this.output).wiki(State.variables.plural_verbs ? args[0] : args[1])
        } else if (args.length != 3) {
            throw new Error("Invalid number of arguments")
        } else jQuery(this.output).wiki(args[0] ? args[1] : args[2]);
    }
});

// Templates for easy access of MC pronouns
// Assumes MC's pronouns are being stored as an array of PronounSets under the variable $pronouns

Template.add(Object.getOwnPropertyNames(new PronounSet("o")), function() {
    
    let set_choice = either(State.variables.pronouns);
    State.variables.plural_verbs = set_choice.plural;
    return set_choice[this.name];
});