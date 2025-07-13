# Custom Domain Setup Options

## Option 1: Use Different Subdomain (Recommended)
Add a new subdomain in Squarespace DNS settings:
- `pay.bowerycreativeagency.com`
- `payments.bowerycreativeagency.com`
- `portal.bowerycreativeagency.com`

### Steps:
1. Log into Squarespace
2. Go to Settings > Domains > Your Domain > DNS Settings
3. Add new CNAME record:
   - Host: `pay` (or `payments` or `portal`)
   - Points to: `bowerycreativepayments.netlify.app`
   - TTL: 300

## Option 2: Move DNS to Netlify (More Complex)
Transfer entire domain management to Netlify DNS

## Option 3: Use Netlify Subdomain
Just use the provided subdomain:
- `bowerycreativepayments.netlify.app`

## Option 4: Get a New Domain
Register a domain like `bowerypayments.com` directly through Netlify