# PseudoWoodo Language Specification
### Version 0.2

*An inflexible, feature-poor, and proof-of-concept language with the end-goal being the creation of an entire programming language with the help of a large language model.*

*PseudoWoodo is an interpreted language written in JavaScript, and inherits its dynamic typing and browser compatability.*

## Features
- Dyanmic typing - I'm lazy; I'm using language features in JavaScript to save me the trouble of implementing new ones.
- Browser compatability - The interpreter is written in JS; unless you're using something ancient, it should work fine in-browser.
- Minimalist philosophy - A proof-of-concept language with Pseudocode-like syntax and a barebones interpreter.

## Reserved Names

PseudoWoodo uses several reserved names/keywords that are outlined in the following specification. Reserved names and session calls should be written in lowercase. Reserved names can not be used as variable names (aside from reserved variables), and will result in an error.

## Primitive Data Types

PseudoWoodo is dynamically typed, as the inerpreter directly passes stored variables to an object in JavaScript.
While it can technically store any value, strings must use single quotes (like this: `'string'`).
There are no restrictions on number formatting, so long as it's a [valid](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_literals) number in JavaScript. Boolean values also follow [JavaScript convention.](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)

## Line Comments

PseudoWoodo supports single-line comments for code documentation. It uses the `rem` keyword, which is short for "remove."

```
rem This line will be ignored at runtime.
rem Like the double-slash operator in JavaScript, this allows you to add documentation directly to your codebase.
```

## Variable Declaration and Reassignment

Variables are defined using the `set` and `as` keywords. Keep in mind that PseudoWoodo does not have block scope; all variables are functioanlly global.

```
set foo as 'bar'
set x as 1
```

If you wish to change the value of variable later on, you can use the `as` keyword without `set` to change the value.

```
set y as 2
y as 9
```

For variable names, PseudoWoodo uses the convention of Lower Kebab Case. Other conventions are syntactically valid, but `lower-kebab-case` is the official reccomendation.

```
set long-variable-name as 'Wow, that's a pretty long variable name.'
set number-two as 2
```

You can also accept user input using the `input` keyword when declaring or reassigning a variable. Input halts execution until the user provides input.

```
set name as input
name as input
```

## Arithmetic Operators

PseudoWoodo supports the `plus`, `minus`, `times`, and `over` operation keywords.

```
set x as 1 times 2
set y as 20 plus 30
```

The `plus` operator also enables string concatenation.

```
set str as 'hello ' plus 'world!'
```

PseudoWoodo is weakly-typed, as the interpreter relies on JavaScript's [built-in arithmetic operations.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dynamic_and_weak_typing)

```
set num-str as 'this is the number one: ' plus 1
```

## Control Flow

As an interpreted language, PseudoWoodo is largely sequential in its execution. The exception is its call functionality, which provides the ability to use conditional and reusable sections of code. Since calls and variable names are tracked separately, a call and a variable can have the same name.

```
call hello

:hello
set hello as 'Hello world!'
```

## Comparison Operators

Following PseudoWoodo's existing convention of using plain-meaning English keywords, comparison oprators are no different.
There are no strict comparison operators in PseudoWoodo.

The comparison operator keywords are as follows:

`is-less-than` (<)

`is-greater-than` (>)

`is-less-than-or-equal-to` (<=)

`is-greater-than-or-equal-to` (>=)

`is-equal-to` (==)

## Logic Operators

In order to facilitate more complex logic, standard logic operators are also present. Bitwise operators are not present.

`and` (&&)

`or` (||)

`not` (!)

## Session Calls

PseudoWoodo has several built-in session calls that add important functionality to the program.
Under the hood, all are passthroughs for native JavaScript functionality.

Since PseudoWoodo uses doesn't have funcitons (or function headers), it instead uses reserved variable names for this funtionality.
When a session call is invoked, it will read the values of the corresponding reserved variables.

The session call `timeout` provides a synchronous timeout that halts execution for the specified amount of time. The `timeout` reserved variable is passed a valid JavaScript Number type in whole seconds (not milliseconds).

```
timeout as 5
call timeout
```

To output to the console, use the `console-log` reserved variable and use the session call `console-log`.

```
console-log as 'This will be passed to the console.'
call console-log
```

You can also clear the entire console using the `console-clear` session call.

```
call console-clear
```


## Conditional Statements

Conditional statements, as mentioned previously, rely on the call functionality.

Here's an example of the `if` conditional statement in action.

```
set x as 1
set y as 2

if x is-less-than y call do-this

:do-this
console-log as x plus ' is definitely less than ' plus y
call console-log
```
The reserved name `else` is also available to add additional functionality to the existing conditional statement.

```
set x as 1
set y as 2

if x is-less-than y call do-this else call do-this-instead

:do-this
console-log as x plus ' is definitely less than ' plus y plus '.'
call console-log
call end

:do-this-instead
console-log as 'For some reason, this came back as false.'
call console-log
call end

:end
```

The `if` and `else` operators only support call statements; you cannot use a single-line set operation with them.

## Looping (Iterating with Conditionals)

While there are no explicit methods to create a loop, using the call system can open up similar functionality to a do-while loop.

In this example, the loop will execute five times.

```
set x as 0
call loop
:loop
x as x plus 1
if x is-less-than-or-equal-to 4 call loop
```

## Arrays

PseudoWoodo supports native JavaScript syntax for arrays, as it passes them directly as arrays to the variable object. Arrays can be single-dimensional or multi-dimensional (e.g., 2D arrays).

Arrays are declared using the `set` and `as` keywords, with values enclosed in square brackets.

```
set my-array as [1, 2, 3, 4]  
set 2d-array as [[1, 2], [3, 4]]  
```

To get the length of an array, use the `length` and `of` keywords followed by the array name.

```
set my-array as [10, 20, 30, 40]  
length of my-array  
``` 

To access an element at a specific index, use the `at-index` and `of` keywords.

```
set my-array as [10, 20, 30, 40]  
at-index 2 of my-array
```  

It should be noted that this keyword also works with strings.

```
set str as 'foo'
at-index 0 of str
```

This will result in a value of 30, as PseudoWoodo uses zero-based indexing.

To modify an element at a specific index, use the `set-index` and `of` keywords with the `as` keyword to specify the new value.

```
set my-array as [10, 20, 30, 40]  
set-index 2 of my-array as 99
```  

For 2D arrays, use the `at-index keyword` with stacked `of` keywords to access elements.

```
set 2d-array as [[1, 2], [3, 4]]  
at-index 0 of 1 of 2d-array
```  

Since PseudoWoodo doesn’t have explicit loops, you can use the existing if and call system to iterate over arrays.

```
set my-array as [10, 20, 30, 40]  
set i as 0  
call loop  

:loop  
console-log as at-index i of my-array
call console-log
i as i plus 1  
if i is-less-than length of my-array call loop 
``` 

This will output each element of the array to the console.