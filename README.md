# ddc-matcher_fuzzy
Fuzzy matcher for ddc.vim

## Required

### denops.vim
https://github.com/vim-denops/denops.vim

### ddc.vim
https://github.com/Shougo/ddc.vim

## Configuration
### params
- camelcase: If it is true, lowercase letters match with uppercase letters.

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
