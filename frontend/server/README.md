# MCP Server Admin Analytics

This server exposes an admin-only route for viewing Google Analytics metrics.

## Configuration

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the following environment variables before starting the server:

   - `ADMIN_TOKEN` – secret token required in the `Authorization` header for
     all `/admin` requests.
   - `GA_CREDENTIALS` – JSON string of your Google service account credentials.
   - `GA_PROPERTY_ID` – Analytics property ID to query.

   Example of starting the server:
   ```bash
   ADMIN_TOKEN=mysecret \
   GA_CREDENTIALS='{"client_email":"...","private_key":"..."}' \
   GA_PROPERTY_ID=123456789 \
   npm start
   ```

## Using the Dashboard

Navigate to `/admin/analytics.html` in your browser. You will be prompted for
the admin token. The page fetches data from the `/admin/analytics` endpoint and
renders a simple chart and table of the returned metrics.

Only requests with the correct token are allowed, so keep the token secret and
share it only with authorized administrators.
