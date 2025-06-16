# BoweryCreative Project Structure

## Proposed Reorganization

```
BoweryCreative/
├── frontend/          → Main website (bowerycreativeagency.com)
├── backend/           → API & backend services  
├── payments/          → Payment portal (start.bowerycreativeagency.com)
├── dashboard/         → Admin dashboard (bowerycreative-dashboard.netlify.app)
├── social-manager/    → New social media manager
└── docs/             → Shared documentation
```

## Current → New Structure

1. `BoweryCreative` → `BoweryCreative/frontend`
2. `BoweryCreative-backend` → `BoweryCreative/backend`
3. `bowerycreativepayments` → `BoweryCreative/payments`
4. `bowerycreative_socialmediamanager` → `BoweryCreative/social-manager`
5. (need to find dashboard) → `BoweryCreative/dashboard`

## Quick Navigation Script

After reorganization, you can navigate with:
```bash
# Add to ~/.zshrc or ~/.bashrc
alias bc="cd ~/BoweryCreative"
alias bcf="cd ~/BoweryCreative/frontend"
alias bcb="cd ~/BoweryCreative/backend"
alias bcp="cd ~/BoweryCreative/payments"
alias bcd="cd ~/BoweryCreative/dashboard"
alias bcs="cd ~/BoweryCreative/social-manager"
```

Ready to proceed with reorganization?