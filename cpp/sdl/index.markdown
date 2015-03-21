---
layout: page
title: Programming games using SDL 2
---

## Programming games using SDL 2

![pic](http://i.imgur.com/E0BFa43.png)

Developing video games is not just fun, but it's a great way to becoming a better programmer. 
Working on a small project can be an additional motivation for you to keep learning,
and improving your skill.  

To program a game, you need to get a full access to the screen, the keyboard, the mouse and maybe other devices of your computer.
The standard C or C++ don't provide such a control over your system out of the box. 
Such system dependent features are usually not a part of the language standard itself, and delegated to graphics libraries, such as SDL, OpenGL, DirectX, or SFML.

[Simple DirectMedia Layer](http://libsdl.org/) (or SDL) is a cross-platform development library designed to provide low level access to audio, 
keyboard, mouse, joystick, and graphics hardware via OpenGL and Direct3D. 
It is used by video playback software, emulators, and popular games including Valve's award winning catalog and many Humble Bundle games.

Good introduction to using SDL 2 with C++: [headerphile blog](http://headerphile.com/):

- [Part 1 – Setting up SDL 2](http://headerphile.com/?p=26)
- [Part 2 – Your first SDL 2 application](http://headerphile.com/?p=23)
- [Part 3 – Drawing rectangles](http://headerphile.com/?p=70)
- [Part 4 – Making things happen](http://headerphile.com/?p=82) (Keyboard events and moving things on the screen)
- ...

Another good tutorial: [LazyFoo's SDL2 tutorial](http://lazyfoo.net/tutorials/SDL/index.php)

### A simple shoot em up game

Source code: [inv.cpp](inv.cpp)

![shmup](http://i.imgur.com/qJPxwC5.png)

