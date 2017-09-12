---
layout: page
title: CSCI 135 - Software Analysis and Design 1
---

## A Unix environment on your computer
  If your OS is:
  
  **Linux**. You already have everything. Make sure to install **g++** if it is not already there. 
  
  **OSX**.
  You already have everything. It may come with **g++** pre-installed. However, if it's not the case, install Xcode or its Command Line Tools.
  [This link](http://osxdaily.com/2014/02/12/install-command-line-tools-mac-os-x/) may be helpful.
  Open the Terminal and you are good to go.     

  **Windows**.
  We have to install [Cygwin](https://cygwin.com/) -- a Unix environment for Windows.    
  [These instructions](http://cs.calvin.edu/curriculum/cs/112/resources/installingEclipse/cygwin/) can help you 
  install it together with the **g++** compiler. When doing installation, make sure you chose to install **gcc-g++** package.    

  > **Video tutorials for installing and using Cygwin on Windows:**
  > 1. [Installing Cygwin with the g++ compiler](https://www.youtube.com/watch?v=ziRGT-8Td40),
  > 2. [Compiling a simple program](https://www.youtube.com/watch?v=0FzjiSneLv8).    
  > (The main takeaway is to put your code in the Cygwin **home directory**, which is located at `C:\cygwin\home\<your-user-name>\`)

  **Web-based**. 
  If the above options don't work for you, there are several web applications 
  to compile and run your code online: [C++Shell](http://www.cpp.sh/) or [JDoodle](https://www.jdoodle.com/online-compiler-c++) (turn the interactive mode on).
  
  <!-- [](http://www.tutorialspoint.com/compile_cpp_online.php) -->

## Text Editor
  **For this class, I strongly discourage using Xcode or any other IDE.** We need only a text editor and a terminal window.
  
  **On Mac OSX**, use a simpler text editor, for example [TextMate](http://macromates.com/download) or [Sublime Text](http://www.sublimetext.com/),
  they are good free options. Use it only for editing code, run your programs from the terminal.
  
  **On Windows**, [Notepad++](http://notepad-plus-plus.org/) and [Sublime Text](http://www.sublimetext.com/) are a good free text editors I can recommend.

  **If you are using Vim (and Vi) text editor:**
  The editor does not come with a good default configuration.
  Please refer to this [quick guide](/cs136/vim/) to make it suitable for editing code.
