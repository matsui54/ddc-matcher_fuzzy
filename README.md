# ddc-matcher_fuzzy
Fuzzy matcher for ddc.vim

## Required

### denops.vim
https://github.com/vim-denops/denops.vim

### ddc.vim
https://github.com/Shougo/ddc.vim

## Configuration
For details, please see [help](doc/ddc-matcher_fuzzy.txt).

### examples
```vim
call ddc#custom#patch_global('sourceOptions', {
      \ '_': {
      \   'matchers': ['matcher_fuzzy'],
      \ })

call ddc#custom#patch_global('filterParams', {
    \ 'matcher_fuzzy': {'camelcase': v:true},
    \ })
```
