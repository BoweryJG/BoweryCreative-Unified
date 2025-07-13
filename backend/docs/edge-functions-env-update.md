# Updating Edge Functions Environment Variables

## Payment Portal URL Update

After the refactoring, the payment portal has moved from `start.bowerycreativeagency.com` to `pay.bowerycreative.com`. The Edge Functions need their environment variables updated.

### Required Updates

1. **Update SITE_URL in Supabase Dashboard**:
   - Go to your Supabase project dashboard
   - Navigate to Settings → Edge Functions
   - Update the following environment variable:
     ```
     SITE_URL=https://pay.bowerycreative.com
     ```

2. **Functions Affected**:
   - `admin-create-invoice` - Uses SITE_URL for payment links
   - `admin-create-portal-session` - Uses SITE_URL for return URLs
   - `admin-send-setup-email` - Uses SITE_URL for setup links

3. **Local Development**:
   Add to your `.env.local` file:
   ```env
   SITE_URL=https://pay.bowerycreative.com
   ```

4. **Production Deployment**:
   In the Supabase Dashboard, update the Edge Functions secrets/environment variables section.

### Testing

After updating:
1. Test invoice creation to ensure payment links use `pay.bowerycreative.com`
2. Test Stripe portal sessions to ensure return URLs are correct
3. Test setup emails to ensure links point to the correct domain

### Rollback

If needed, you can temporarily revert by changing SITE_URL back to `https://start.bowerycreativeagency.com` until the new payment portal is fully deployed.