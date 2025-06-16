# Social Manager Environment Variables for Render

Click "+ Add Environment Variable" for each of these:

## Database (copy from your backend service)
```
SUPABASE_URL = https://fiozmyoedptukpkzuhqm.supabase.co
SUPABASE_SERVICE_KEY = [copy from your backend service]
```

## Email (copy from your backend service)
```
EMAIL_USER = [copy from backend]
EMAIL_PASS = [copy from backend]
EMAIL_FROM = magic@bowerycreative.com
```

## Facebook App (from your "Robotic AI" app)
```
FB_APP_ID = [your facebook app id]
FB_APP_SECRET = [your facebook app secret]
FB_REDIRECT_URI = https://bowerycreative-socialmanager.onrender.com/auth/facebook/callback
```

## Session & Security (click "Generate" for these)
```
SESSION_SECRET = [click Generate button]
ENCRYPTION_KEY = [click Generate button]
```

## App URLs
```
APP_URL = https://bowerycreative-socialmanager.onrender.com
DASHBOARD_URL = https://bowerycreative-dashboard.netlify.app
```

## Optional (if needed)
```
PORT = 8080
NODE_ENV = production
```

---

To get the values from your backend:
1. Open another tab with your Render dashboard
2. Click on "bowerycreative-backend" service
3. Go to "Environment" tab
4. Copy the values for SUPABASE_SERVICE_KEY, EMAIL_USER, EMAIL_PASS