---
layout: page
title: CSCI 49201 - Functional Programming in OCaml - Projects
---

<!--
## Presentations Schedule

### May 2

1. Shawn Guthrie  -  Chess
2. Tushar Malakar  -  Huffman Coding
3. Kent Feng & Jin Huai Xuan  -  Cellular Automata Simulator
4. Savannah Nester  -  Snake Game
5. Maria Volpe  -  OCaml FFI (interfacing with C)
6. Ali Almashhadani  -  Markdown to HTML
7. Aaron Lopez  -  Functional KMP Algorithm
8. Ratul Ahmed  -  NBA Data Visualizer
9. Brandon Foster  -  LISP Interpreter
10. Zhifan Yang  -  Klotski Game and Solver
11. Stephen Duke  -  Tour Scheduler

### May 9

12. Tenzin Kunsang  -  Stock Analyzer
13. Jonah Alexander-awad  -  GUI application
14. Elijah Augustin  -  Markdown Converter
15. Alexander Bortoc  -  Bookshelf using PostgreSQL
16. Daniel Segarra & Angel Checo  -  ReasonML Game
17. Clara Fairbanks  -  Infinite Runner
18. Pasang Sherpa  -  City Art Generation
19. Ram Vakada  -  OCamlAlert, client-server application using Lwt
20. Jeffrey Lin  -  Lambda Calculus
21. Jonathan Trachtenberg  -  Stock Tracker
22. Hugh Leow  -  Spaceship Destroyer
23. Garrison Shepard  -  Story Generator
-->

## Projects

In the second half of this course, you will work on a project, which will replace regular homework assignments.

### Timeline:
- June 12 - **Choose a project topic**.
- June 17 - **First draft of your project proposal**: 3-5 paragraphs description of the project goal, scope, and implementation plan.
- June 24 - **Finalized project proposal**: Have a proof of concept. Create a Github repository and send me its link.
- July 8 - **Project presentations** (quick presentation in class and a 2-3 page report).

The topic for your project must be discussed and approved before you start working on it.

All projects are individual.

**Github repo:**
You will have to create a Github repository for your project, so your progress can be tracked.
Update the repository regularly, at least twice a week.
If your repository remains dormant until the last few days, when you suddenly upload everything,
you may get a low grade for the project. 

**On borrowing code:**
If you use someone else's code, it must be clearly stated in the project README, what code is yours, and what code is borrowed.
Try to keep borrowed code in separate modules (separate files) from your own code to make distinction clear.

**Functional style:**
Your implementation should use only functional aspects of the language 
(modules List, Map, Set, and String should be your main data structure, together with variant types, tuples, and immutable records).
You still can use libraries that work in the imperative fashion with hidden mutable state, however your own code should stay functional or mostly functional.

<center><img src="https://i.imgur.com/pA52XaK.png" /></center>

### Possible project topics

- Check out the [Awesome-OCaml](https://github.com/ocaml-community/awesome-ocaml) collection, if you like any of those
projects or libraries, it can help you pick an idea for your program.
- Think what application you would like to develop. It does not have to be big and complex, but should be non-trivial enough.
It should pose a challenge, but you have to have a relatively concrete implementation plan of how to solve it. 

Some possible specific topics (if you don't have any particular idea in mind):

- Huffman coding for file compression (there is a functional tree construction algorithm at its core).
- Markdown to HTML converter (also can design your own markup language).
- Scientific simulation or mathematical modeling for Physics/Chemistry/Biology.
- Procedural art or other image generation using vector graphics library Cairo (package [cairo2](https://github.com/Chris00/ocaml-cairo)). 
Take a look at [Context Free Art](https://www.contextfreeart.org/index.html) for examples of recursive declarative images.
- Develop a simple data plotting software similar to [gnuplot](http://www.gnuplot.info/) or [matplotlib](https://matplotlib.org/),
using library Cairo (package [cairo2](https://github.com/Chris00/ocaml-cairo)) for output.
- Declarative terminal graphics with package [notty](https://github.com/pqwy/notty).
- Simple video game (using package [tsdl](https://erratique.ch/software/tsdl) or 
built-in module [Graphics](https://caml.inria.fr/pub/docs/manual-ocaml/libref/Graphics.html)).
- GUI application ([Tcl/Tk](http://labltk.forge.ocamlcore.org/index.html) or [GTK](http://lablgtk.forge.ocamlcore.org/)).
- Declarative reactive programming with package [react](https://github.com/dbuenzli/react).
- Theory: Lambda calculus, combinator calculus, concatenative languages (e.g. Joy).
- Interpreter for a simple programming language (if you take the programming languages class), implemented using parsers such as Menhir and Opal.
- Pretty printer for a C-style language (similar to [astyle](http://astyle.sourceforge.net/)).
- Your own OCaml syntax extension (ppx).
- Foreign Function Interface (interfacing with C code).
- Web application using Sinatra-like framework [opium](https://github.com/rgrinberg/opium).
- Property fuzzing for OCaml programs with package [crowbar](https://github.com/stedolan/crowbar).
- Lightweight concurrency in OCaml using [Lwt](https://github.com/ocsigen/lwt).
- A Unix utility such as `tree` or `grep`. Should implement command-line flags and options. Use modules Sys and Unix.    
- Of course, you are encouraged to come up with your own topic, that would be even better. 

### Example projects from Spring 2019:

- [Interpreter for a subset of Lisp](https://github.com/BrandonFoster/csci-49201-01-simple-interpreter-in-ocaml)
- [Scheduler application](https://github.com/jengajenga/Tour-Scheduler)
- [Cellular automata](https://github.com/ocamlca/Cellular-Automaton-Ocaml)
- [ReasonML game](https://github.com/buhotech/OGalaga)

### Grading criteria

- Good function decomposition: Design your functions well, good helper functions make code easy to write and read
- Not using imperative constructs 
- Meeting your stated project goals: It is okay to backtrack sometimes, but reaching your initial goals is always a plus.
- Complexity of the chosen topic: You can be a bit ambitious.
- Topic originality: An interesting original project can be useful to other people.
- Regularity of the code updates on Github: New commits at least once a week is a good pace.
- Presentation and report quality

### How to use libraries

<center> <img src="https://i.imgur.com/fRBWGjZ.jpg" /> </center>

If you want to use a library, **library calls shouldn't make the majority of your code**. The goal is to develop functional programming skill, not to 
learn a specific library.

OCaml libraries are usually high quality, but documentation may be lacking. If you choose to use a library,
make sure:

- **it has some documentation you can work with**
- **it provides examples, and you are able to compile and run these examples** (so you can start modifying them, developing your program right away)
- if it is using some complex technology, you should **know that technology** before you start the project
- if it is OCaml bindings of a C library, you should know how that C library works. You may have to read the docs for the original C library, 
since they will be more complete and will have more examples.

It is also highly recommended to use only the libraries that can be **installed with _opam_ package manager** 
(or if they are single-file libraries that can be simply added to your code base).
Opam is the de facto standard now, so a library not supporting it is likely to be out-of-date, not maintained, or hard to use.

#### *.mli* (interface) files: 

Module interface files (.mli) in OCaml are in some sense similar to header files (.h) in C and C++. They don't have to included in (.ml) files, but
they contain the interface of the modules, that is, its type declarations, function signatures, and documentation about the module.
Sometimes, they are actually the most definitive source of information about the library functions (if the library does not have web-page).

For example, [list.mli](https://github.com/ocaml/ocaml/blob/trunk/stdlib/list.mli) for the 
module [List](https://caml.inria.fr/pub/docs/manual-ocaml/libref/List.html) from the standard library
contains full documentation about the module. (In fact most of the time, the HTML documentation *is* generated from .mli files.)

While .mli files are not always very easy to read, they can be very useful, especially if you don't have any other documentation for the library.

#### How to compile code that is using a library

Generally, to compile your program that is using a library, a good strategy is to consult the examples provided by the library itself.

However, most of the time, the `ocamlfind` works. Especially if the library is installed with opam,
then adding the library is only a matter of adding options `-package NAME -linkpkg` to the `ocamlfind` command (here replace `NAME` with the name of the library 
you want to use). 

**For example:**
Suppose you want to use library `cairo2`, your own code consists of 3 files: `file1.ml`, `file2.ml`, and `file3.ml`,
and you want to compile it into an executable called `program`. Then the following command will work:

```
ocamlfind ocamlopt -package cairo2 -linkpkg -o program file1.ml file2.ml file3.ml
```

For more information, consult [this article](https://ocaml.org/learn/tutorials/compiling_ocaml_projects.html).

[pdfimg]: /img/pdf1.png
[videoimg]: /img/video.png
