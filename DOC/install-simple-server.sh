sudo adduser panetone 
sudo adduser galo 
sudo adduser galo sudo 
sudo adduser panetone sudo 

sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install  zip unzip curl git apt-transport-https net-tools libcurl4-openssl-dev nmon htop ufw locales curl htop lsof ecryptfs-utils cryptsetup net-tools nmap zsh nodejs npm ca-certificates  systemd-timesyncd   software-properties-common libxslt1-dev libcurl4 libgeoip-dev  -y

sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
# close term and open
git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
nano . ~/.zshrc
####################################
ZSHTHEME="spacechip"
### end of file paste
SPACESHIP_PROMPT_ORDER=(
  user # Username section
  dir # Current directory section
  host # Hostname section
  git # Git section (git_branch + git_status)
  hg # Mercurial section (hg_branch + hg_status)
  exec_time # Execution time
  line_sep # Line break
  jobs # Background jobs indicator
  exit_code # Exit code section
  char # Prompt character
)

SPACESHIP_USER_SHOW=always
SPACESHIP_PROMPT_ADD_NEWLINE=false
SPACESHIP_CHAR_SYMBOL="❯"
SPACESHIP_CHAR_SUFFIX=" "

#####################################

git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
nano . ~/.zshrc
#### ....
plugins={
  git
  zsh-syntax-highlighting  ## <---
  zsh-autosuggestions  ## <---
### ....

###########   ZSH
# nano .zshrc
# ZSH_THEME="rkj-repos"
source ~/.zshrc
### PANELS

### NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.zshrc
nvm install 22.17
nvm alias default 22.17

##  AAPANEL
URL=https://www.aapanel.com/script/install_7.0_en.sh && if [ -f /usr/bin/curl ];then curl -ksSO "$URL" ;else wget --no-check-certificate -O install_7.0_en.sh "$URL";fi;bash install_7.0_en.sh aapanel


-----BEGIN PGP MESSAGE-----

jA0ECQMKGMqfpp3ZCmP/0pQBQ8BieF+oQrdtDLkX3tGoAIoPkC1c7EPlulE2qcuz
RU1BpDEhdHLM62x4P8+tvGXBCxFlm8HGdQLAG5fGcp8RKWqMQ6brJTPwyXG9WdwJ
YhZvIUiZ0yl8vIicZLPBnnmjUnfzFVa3LzrZYnUGkZazRz1CQaUcDWxmyVr2MOpU
mkI/DVVsY9bbk/2rMSi9wi9gYoTa
=ok1v
-----END PGP MESSAGE-----
