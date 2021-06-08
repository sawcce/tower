# Tower

Tower is an esoteric language meaning it is designed to be fun to use or a headache to program in !

- [Main](#tower)
- [Concept](#concept)
- [Navigation](#navigation)
- [Manipulations](#manipulation)
- [Messages](#messages)
- [Data types](#data-types)
- [Closures](#closures)
- [Commands](#commands)

## Concept

Tower handles data via an array of "Towers" these towers are actually array that you can navigate through

You can use different operation to reduce these towers into a single cell containing for example a message, action or number.

## Navigation

< To select the tower on your left 

\> To select the tower on your right

^ To select the row above you 

v To select the row under you

lef / rig which I'll cover later on

## Manipulation

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

Just so you know how it works using "/" on 

    |====|
    | 2  |
    | 5  |
    | 10 |
    | 10 |
    | 40 |
    |====|

would give 

    |=====|
    | 0.2 |
    |=====|

## Messages

The operator @ on the other hand, even it collapses the tower, it does it in a more intricate way: when using it, it will transform the first of the tower into a message

    |====|
    | 20 |
    | 50 |
    | 15 |
    | 11 |
    | 44 |
    |====|

using @ on this tower would give this tower:

    |==================|
    | [44,11,15,50,20] |
    |==================|
when using the "say" command, it would print the corresponding ascii message to the console

## Data types

Whenever the interpreter spots a value it will put the current cell to that value

    15  150
    78  356

At the end of this program (since tower is executed like js/python/c...) the current cell will be at the value of 356

### Closures

Closures are snippets of code that can be executed with the command "exe".

They act like numbers, meaning whenever the interpreter spots a closure it will put the current cell's value to the closure

    [84 ^ 111 ^ 119 ^ 101 ^ 114 @ say] 
    exe

This simple program defines a program that has a closure printing the word "Tower" to the console. The second line will just execute the closure

\>WARNING] Right now closures only support global scopes which means that whatever modification you do in the closure will be kept in after it has finished running

(I will add private scopes later on)

## Commands

Say : Prints the current selected cell to the console

Lef : Goes -the value in the current cell- times to the left

Rig : Goes -the value in the current cell- times to the right

Exe : Executes the closure in the current selected cell

Cur : gives you the x position of the cursor (meaning how much towers you are to the left of tower 0)
Ask : Sets the current cell to the list of ascii codes entered in the console at that moment (input in python)

Num : Will convert the equivalent any number in ascii back into a number (useful when used with ask)

Char : Takes the first element in a message and will give you it's ascii code (useful when used with ask)

Get : Copies the value of the current cell into a virtual clipboard

Set : Takes the value of the virtual clipboard and set the current cell to it's value

Say : Says the value of the current cell

## Examples

For more examples check the directory examples

    # Calculates and says the sum of two entered numbers

        ask num
    ^   ask num
    +
    say


    # Concatenates and says two messages

        ask
    ^   ask
    @
    say




