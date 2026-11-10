# Pronouns & verbs
Set of tools for handling pronouns based around the custom PronounSet class

## Usage
### Pronoun settings
To create a button that opens pronoun settings use:
```
<<button "Customize pronouns">>
    <<script>>
    Dialog.create("Pronoun settings")
    Dialog.wikiPassage("dialog-pronoun-settings")
    Dialog.open();
    <</script>>
<</button>>
```

### `<<verb>>` macro
The verb macro has two usage options:
* `<<verb \[conditional\] \[plural verb\] \[singular verb\]>>` If conditional is true, it outputs the plural verb, else outputs the singular verb
* `<<verb \[plural verb\] \[singular verb\]>>` If the variable `$plural_verbs` is true, it outputs the plural verb, else outputs the singular verb

`$plural_verbs` is automatically handled by pronoun templates.

### Templates
Includes the following templates:
* ?they, ?They
* ?them, ?Them,
* ?their, ?Their
* ?theirs, ?Theirs
* ?themself, ?Themself
* ?theyre, ?Theyre
* ?person, ?Person

Templates randomly select a grammatically matching pronoun from the MC's pronoun sets, then updates `$plural_verbs`. Due to implementation, pronouns are not gauranteed to match within a passage, and it is recommended that this be kept in mind while using the templates.

Templates autopopulate from the properties of the PronounSet class.

## Adding gendered terms to a PronounSet
The only pre-packed gendered term is "person." To add more, go to the `__constructGenderedTerms()` function in the definition for `PronounSet` in the file `pronouns.js`. Use the function `addGenderedTerm()` to add more terms. This automatically creates templates for added terms.

## Additional notes
The pronoun tools use the following variables:
* `$pronouns`: an array of PronounSets

It's trivial to use PronounSets for NPCs. Example code:
```
<<if $ro_gender is "nb">>
    <<set $r to new PronounSet("o")>>
<<elseif $ro_gender is "f">>
    <<set $r to new PronounSet("f")>>
<<else>>
    <<set $r to new PronounSet("m")>>
<</if>>

"I feel like a whole new $r.person," says $r_name. You think $r.they really <<verb $r.plural "mean" "means">> it.
```