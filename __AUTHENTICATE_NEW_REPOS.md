# AUTH

## Using Personal Access Tokens

`% gh auth status`
`% gh auth switch`
`% gh auth token | pbcopy` 
`% gpu`
- fill out name from
- paste in token as password

Must be done from within the new repo:

```
# SET
% git config user.email "40064794+dq-mlnck@users.noreply.github.com"
% git config user.name dq-mlnck
# VERIFY
% git config user.email
% git config user.name
```

as a 1 off:
```
git config user.email "40064794+dq-mlnck@users.noreply.github.com" \
&& git config user.name dq-mlnck \
&& git config user.email \
&& git config user.name
```


