set autoindent
set cmdheight=2 "command bar is 2 high
set backspace=indent,eol,start "set backspace function

syntax on
filetype on
filetype plugin on
filetype indent on

set hlsearch "highlight searched things
set incsearch "incremental search
set ignorecase "ignore case
set textwidth=0
set autoread "auto read when file is changed from outside
set ruler "show current position
set nu "show line number
set showmatch "show maching braces

set shiftwidth=4
set tabstop=4
" set expandtab
set t_Co=256
" colorscheme slate
" colorscheme delek
" colorscheme xoria256
" colorscheme wombat256mod
colorscheme getafe
" colorscheme harlequin

set clipboard=unnamed

" Background colors in vim
if &term =~ '256color'
	" disable Background Color Erase (BCE) so that color schemes
	" render properly when inside 256-color tmux and GNU screen.
	" see also http://sunaku.github.io/vim-256color-bce.html
	set t_ut=
endif
