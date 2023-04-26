# [ec2-user@ip-172-31-20-253 ~]$ cat /home/ec2-user/.bashrc
#

# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=a

# User specific aliases and functions

  ### @
alias b='. /home/ec2-user/.bashrc'
alias l='ls -alh'
alias s='sudo su -'
alias v='vi /home/ec2-user/.bashrc'
alias vhosts='confApache'
alias vhostsSSL='confApacheSSL'

  ### CONF
alias confApache='sudo vi /etc/httpd/conf/httpd.conf'
alias confApacheSSL='sudo vi /etc/httpd/conf/httpd-le-ssl.conf'
alias confHosts='sudo vi /etc/hosts'
alias confPhpMyAdmin='sudo vi /etc/httpd/conf.d/phpMyAdmin.conf'
alias confSSH='sudo vi /etc/ssh/sshd_config'
alias confSSL='sudo vi /etc/httpd/conf.d/ssl.conf'

  ### DIRECTORIES
alias dirCerts='/etc/pki/tls/certs'
alias dirHtml='/var/www/html'

  ### HTML
function mvto() {
  # params: deployGlob, destGlob (from /var/www/html)
  echo 'hi' 
}

  ### SERVER
alias ctlStatus='sudo systemctl status'
alias ctlFailed='sudo systemctl --failed'
alias ctlReset='sudo systemctl reset-failed'
alias daemonReload='sudo systemctl daemon-reload'
#
alias apacheRestart='sudo apachectl -k restart'
alias apacheStart='sudo apachectl -k start'
alias apacheStop='sudo apachectl -k stop'
alias apacheTest='sudo pachectl configtest'
# ---
alias apache2Restart='sudo systemctl restart apache2'
alias apache2Start='sudo systemctl start apache2'
alias apache2Stop='sudo systemctl stop apache2'
#
alias mySqlRestart='sudo service mysqld restart'
alias mySqlStart='sudo service mysqld start'
alias mySqlStop='sudo service mysqld stop'
#
alias httpdRestart='sudo systemctl restart httpd'
alias httpdStart='sudo systemctl start httpd'
alias httpdStop='sudo systemctl stop httpd'
#
alias sshdRestart='sudo /etc/init.d/sshd restart'
alias sshdStart='sudo /etc/init.d/sshd start'
alias sshdStop='sudo /etc/init.d/sshd stop'
#
alias wikiEdit='sudo vi /etc/systemd/system/wiki.service'
alias wikiLog='journalctl -u wiki'
alias wikiResart='sudo systemctl restart wiki'
alias wikiStart='sudo systemctl start wiki'
alias wikiStop='sudo systemctl stop wiki'
#
alias sslCert='sudo certbot' #uses letencrypt

  ### EXPORTS
export NVM_DIR="$HOME/.nvm"
[ -sjllkgs

"$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
