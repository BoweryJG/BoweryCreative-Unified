#!/bin/bash

# BoweryCreative Navigation Aliases
# Add these to your ~/.zshrc or ~/.bashrc

echo "# BoweryCreative Aliases" >> ~/.zshrc
echo "alias bc='cd ~/BoweryCreative-Unified'" >> ~/.zshrc
echo "alias bcf='cd ~/BoweryCreative-Unified/frontend'" >> ~/.zshrc
echo "alias bcb='cd ~/BoweryCreative-Unified/backend'" >> ~/.zshrc
echo "alias bcp='cd ~/BoweryCreative-Unified/payments'" >> ~/.zshrc
echo "alias bcd='cd ~/BoweryCreative-Unified/dashboard'" >> ~/.zshrc
echo "alias bcs='cd ~/BoweryCreative-Unified/social-manager'" >> ~/.zshrc
echo "" >> ~/.zshrc
echo "# BoweryCreative Dev Commands" >> ~/.zshrc
echo "alias bc-dev-all='bc && ./start-all-dev.sh'" >> ~/.zshrc
echo "alias bc-status='bc && git submodule foreach git status'" >> ~/.zshrc

echo "✅ Aliases added to ~/.zshrc"
echo "Run 'source ~/.zshrc' to activate them"