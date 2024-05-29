to enable any of the files within this directory move them (or their enclosing folder) up one level to reside under `.github`

Stats from date:
```
git log --shortstat --author="mlnck" --since="12 Nov, 2023" | grep -E "fil(e|es) changed" | awk '{files+=$3; inserted+=$6; deleted+=$8; delta+=$6-$8; ratio=deleted/inserted} END {printf "\033[4mCommit stats\033[0m:\n- \033[33mFiles changed\033[0m (\033[37;3mtotal\033[0m)..  \033[36;1m%s\n\033[0m- \033[33mLines added\033[0m (\033[37;3mtotal\033[0m)....  \033[36;1m%s\033[0m\n- \033[33mLines deleted\033[0m (\033[37;3mtotal\033[0m)..  \033[36;1m%s\n\033[0m- \033[33mTotal lines\033[0m (\033[37;3mdelta\033[0m])....  \033[36;1m%s\n\033[0m- \033[33mAdd./Del. ratio\033[0m (\033[37;3m1:n\033[0m)..  \033[36;1m1 : %s\n\033[0m", files, inserted, deleted, delta, ratio }' -
```