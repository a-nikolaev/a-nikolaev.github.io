---
layout: page
title: CSCI 135/136 - Configuring Vim text editor
---

## Configuring Vim

## The lazy way: A quick shell script that will do all setup automatically

Although you are advised to configure Vim manually as described in the next section,
you also may use the following script that can do everything automatically.
Copy this shell script
[setup-vim.sh](https://gist.githubusercontent.com/a-nikolaev/54d45eb14d80905452dcafadadc5635f/raw/e3435ea9a2a3393cdb33373df6354c3b7a3bc104/setup-vim.sh)
(you may save it in HOME, for example). Then give it executable permissions and run:

    chmod +x setup-vim.sh
    ./setup-vim.sh

It will create the following files in your file system:

    ~/.vimrc
    ~/.vim/colors/harlequin.vim
    ~/.vim/colors/desertink.vim
    ~/.vim/colors/wombat256mod.vim

## The good way: And the intro to configuring Vim

**Vim** (Vi improved) can be run from the terminal as follows:

    vim program.cpp

By default, the editor comes with an extremely minimal default configuration.
In particular, it does not have code indentation turned on. 
To enable this code editing functionality, you need to make a configuration file called `.vimrc` in your HOME directory.

### .vimrc file

Download this 
[.vimrc](https://gist.githubusercontent.com/a-nikolaev/a8bfc7988319944608b57f06df2376ea/raw/99dc4116c883d8b21689f5ca6e616171f56703bd/.vimrc)
file and put in your HOME directory.

>   Note that in Unix, the **files that start with a dot are hidden**, so you might not be able to see it by default
    after copying. To make the command `ls` show all hidden files,
    use the option `-a`, for example:

> 
    ls -a ~

### Adding good color schemes 
New color schemes should be stored in `~/.vim/colors`

Make this directory if you don't have it yet:

    mkdir ~/.vim
    mkdir ~/.vim/colors

Copy the following three color schemes files in `~/.vim/colors`:   

  * [harlequin.vim](https://raw.githubusercontent.com/nielsmadan/harlequin/master/colors/harlequin.vim)
  * [desertink.vim](https://raw.githubusercontent.com/toupeira/vim-desertink/master/colors/desertink.vim)
  * [wombat256mod.vim](https://raw.githubusercontent.com/michalbachowski/vim-wombat256mod/master/colors/wombat256mod.vim)

Edit the `.vimrc` configuration file to choose the color scheme you like. For example, to choose Harlequin, add a line:

    colorscheme harlequin

The `.vimrc` I gave you, already contains the lines to enable the color schemes you just downloaded. Just uncomment the corresponding line
(note that the file is using double quote symbol `"` to mark comments).

You can find more color schemes here: \[[See this huge list](http://vimcolors.com/)\].

