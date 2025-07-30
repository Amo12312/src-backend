# Hostinger Deployment Guide

## Prerequisites
1. Hostinger hosting account with Node.js support
2. Razorpay account with API keys
3. Git repository access

## Step 1: Prepare Your Environment Variables

Create a `.env` file in your backend directory with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_PLAN_ID=your_razorpay_plan_id_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

## Step 2: Upload Files to Hostinger

### Option A: Using File Manager
1. Log into your Hostinger control panel
2. Go to File Manager
3. Navigate to your domain's public_html folder
4. Create a new folder called `backend` or `api`
5. Upload all backend files to this folder:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `.env` (with your actual values)
   - Any other backend files

### Option B: Using Git (Recommended)
1. In Hostinger control panel, go to Git
2. Connect your repository
3. Set the deployment path to your backend folder

## Step 3: Install Dependencies

### Via SSH (if available):
```bash
cd /path/to/your/backend
npm install --production
```

### Via Hostinger Terminal:
1. Go to Hostinger control panel → Terminal
2. Navigate to your backend directory
3. Run: `npm install --production`

## Step 4: Start the Application

### Option A: Using Hostinger's Node.js App Manager
1. Go to Hostinger control panel → Node.js
2. Create a new Node.js app
3. Set the app path to your backend directory
4. Set the startup file to `server.js`
5. Set the Node.js version to 18 or higher
6. Add your environment variables in the app settings

### Option B: Using PM2 (if SSH access available)
```bash
npm install -g pm2
pm2 start server.js --name "rewiametta-backend"
pm2 save
pm2 startup
```

## Step 5: Configure Domain/Subdomain

1. In Hostinger control panel, go to Domains
2. Create a subdomain (e.g., `api.yourdomain.com`) or use a subdirectory
3. Point it to your backend directory
4. Configure reverse proxy if needed

## Step 6: Test Your API

Your API endpoints will be available at:
- Health check: `https://yourdomain.com/`
- Create subscription: `https://yourdomain.com/create-subscription`

## Environment Variables Setup in Hostinger

### For Node.js App Manager:
1. Go to your Node.js app settings
2. Find the "Environment Variables" section
3. Add each variable:
   - `RAZORPAY_KEY_ID` = your_actual_key_id
   - `RAZORPAY_KEY_SECRET` = your_actual_key_secret
   - `RAZORPAY_PLAN_ID` = your_actual_plan_id
   - `NODE_ENV` = production
   - `PORT` = 3000

## Troubleshooting

### Common Issues:
1. **Port not accessible**: Make sure your app is configured to use the correct port
2. **Environment variables not loading**: Check that they're properly set in Hostinger's Node.js app settings
3. **CORS issues**: The server is configured to allow all origins, but you may need to restrict this in production

### Logs:
- Check Hostinger's Node.js app logs for errors
- Use `console.log()` statements in your code for debugging

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to Git
2. **CORS**: Consider restricting CORS origins in production
3. **HTTPS**: Ensure your domain uses HTTPS
4. **Rate Limiting**: Consider adding rate limiting for production use

## API Endpoints

- `GET /` - Health check
- `POST /create-subscription` - Create Razorpay subscription
  - Body: `{ "amount": 1000, "name": "John Doe", "email": "john@example.com", "contact": "1234567890" }`

## Support

If you encounter issues:
1. Check Hostinger's Node.js documentation
2. Verify all environment variables are set correctly
3. Check the application logs in Hostinger's control panel
4. Test locally first to ensure the code works 