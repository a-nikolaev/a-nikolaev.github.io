---
layout: page
title: CSCI 135 - Setup Vim text editor
---

## Intro on configuring Vim

**Vim** (Vi improved) can be run from the terminal as follows:

    vim program.cpp

By default, the editor comes with an extremely minimal default configuration.
In particular, it does not have code indentation turned on. 
To enable this code editing functionality, you need to make a configuration file called `.vimrc` in your HOME directory.

## .vimrc file

Download this [.vimrc](.vimrc) file and put in your HOME directory.

>   Note that in Unix, the **files that start with a dot are hidden**, so you might not be able to see it by default
    after copying. To make the command `ls` show all hidden files,
    use the option `-a`, for example:

> 
    ls -a ~

## Adding good color schemes 
New color schemes should be stored in `~/.vim/colors`

Make this directory if you don't have it yet:

    mkdir ~/.vim
    mkdir ~/.vim/colors

Copy the following three color schemes files in `~/.vim/colors`:   

  * [harlequin.vim](https://raw.githubusercontent.com/nielsmadan/harlequin/master/colors/harlequin.vim)
  * [getafe.vim](https://raw.githubusercontent.com/larssmit/vim-getafe/master/colors/getafe.vim)
  * [wombat256mod.vim](https://raw.githubusercontent.com/michalbachowski/vim-wombat256mod/master/colors/wombat256mod.vim)

Edit the `.vimrc` configuration file to choose the color scheme you like. For example, to choose Getafe, add a line:

    colorscheme getafe

The `.vimrc` I gave you, already contains the lines to enable the color schemes you just downloaded. Just uncomment the corresponding line.

Find more color schemes, if you want: \[[See this huge list](http://vimcolors.com/)\].
