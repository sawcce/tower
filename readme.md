# Tower

Tower is an esoteric language meaning it is designed to be fun to use or a headache to program in !

## Concept

Tower handles data via an array of "Towers" these towers are actually array that you can navigate through

You can use different operation to reduce these towers into a single cell containing for example a message, action or number.

## Core Commands

### Navigation

< To select the tower on your left 

\> To select the tower on your right

^ To select the row above you 

v To select the row under you

lef / rig which I'll cover later on

### Manipulation

The basic operations are present as manipulations that you can execute on the towers

* / - + will "collapse" the Tower meaning it will go row by row and execute the desired operation on each row

If you were to have such a tower 

    |===|
    | 1 |
    | 5 |
    |===|

And used the command "+" the tower would transform into 

    |===|
    | 6 |
    |===|
