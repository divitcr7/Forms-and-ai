# Production Deployment Guide

## Quick Fix for Vercel Deployment Issues

### Required Environment Variables

Add these environment variables to your Vercel project:

1. **Clerk Authentication** (Required):

   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
   CLERK_SECRET_KEY=sk_test_xxx
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

2. **Database** (Required):

   ```
   DATABASE_URL=postgresql://your_connection_string
   ```

3. **Google AI** (Required for form generation):

   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
   ```

4. **Convex** (Optional - only if using Convex features):
   ```
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   CONVEX_DEPLOYMENT=your-deployment-name
   ```

### Vercel Deployment Steps

1. **Set Environment Variables**:

   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add all the required variables listed above

2. **Database Setup**:

   - Make sure your PostgreSQL database is accessible from Vercel
   - Run database migrations: `npx prisma migrate deploy`
   - Generate Prisma client: `npx prisma generate`

3. **Build Configuration**:

   - The `package.json` already includes the correct build command
   - Prisma generation is handled automatically in the build process

4. **Deploy**:
   ```bash
   git push origin main
   ```
   - Vercel will automatically deploy from your main branch

### Common Issues & Solutions

#### 1. "Failed to save form" Error

**Cause**: Missing or incorrect environment variables
**Solution**:

- Check that all required environment variables are set in Vercel
- Verify DATABASE_URL is correct and accessible
- Ensure Clerk keys are valid

#### 2. Database Connection Errors

**Cause**: Database not accessible from Vercel or incorrect connection string
**Solution**:

- Use a cloud PostgreSQL provider (Neon, Supabase, PlanetScale)
- Ensure connection string includes SSL mode: `?sslmode=require`
- Check database allows connections from Vercel's IP ranges

#### 3. Authentication Issues

**Cause**: Clerk configuration mismatch
**Solution**:

- Verify Clerk publishable key matches your Clerk application
- Check that redirect URLs are correctly configured
- Ensure Clerk webhook URLs are set if using webhooks

#### 4. Convex Initialization Errors

**Cause**: Missing Convex URL in production
**Solution**:

- The app now gracefully handles missing Convex configuration
- If you don't need Convex, you can ignore these variables
- If you do need Convex, set NEXT_PUBLIC_CONVEX_URL

### Environment Variable Checklist

Before deploying, ensure you have:

- [ ] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
- [ ] CLERK_SECRET_KEY
- [ ] DATABASE_URL
- [ ] GOOGLE_GENERATIVE_AI_API_KEY
- [ ] All redirect URLs configured in Clerk dashboard
- [ ] Database is accessible and migrated
- [ ] SSL certificates are valid

### Testing Production Deployment

1. Visit your deployed URL
2. Try to sign in/sign up
3. Create a new form
4. Verify the form saves successfully
5. Test form submission

### Getting Help

If you're still experiencing issues:

1. Check Vercel deployment logs
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Test database connection separately
5. Check Clerk dashboard for authentication issues

## Database Providers

### Recommended PostgreSQL Providers:

1. **Neon** (Recommended)

   - Free tier available
   - Serverless PostgreSQL
   - Good for Vercel deployments

2. **Supabase**

   - Free tier available
   - Full-featured backend

3. **PlanetScale**

   - MySQL-compatible
   - Requires schema changes for Prisma

4. **Railway**
   - Simple deployment
   - PostgreSQL support
