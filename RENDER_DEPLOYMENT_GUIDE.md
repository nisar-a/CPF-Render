# 🚀 Render Deployment Guide - CPF Project

Deploy your Backend and Frontend separately on Render.

---

## STEP 1: Verify MongoDB Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and login
2. Click **Network Access** (left sidebar)
3. Ensure `0.0.0.0/0` is in the IP Access List
   - If not: Click **Add IP Address** → **Allow Access from Anywhere** → **Confirm**

---

## STEP 2: Deploy Backend Service

### A. Create Backend Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your Git repository (GitHub/GitLab/Bitbucket)
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `cpf-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

### B. Add Backend Environment Variables

Click **Advanced** → **Add Environment Variable** and add these 4 variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0` |
| `JWT_SECRET` | `choosekonguengineeringcollegeforbestfuture2026SecureKey` |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |

### C. Deploy Backend

1. Click **Create Web Service**
2. Wait 5-10 minutes for deployment
3. **COPY YOUR BACKEND URL** (e.g., `https://cpf-backend.onrender.com`)

---

## STEP 3: Deploy Frontend Service

### A. Create Frontend Static Site

1. In Render Dashboard, click **New +** → **Static Site**
2. Connect the **same repository**
3. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `cpf-frontend` |
| **Branch** | `main` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `build` |

### B. Add Frontend Environment Variable

Click **Advanced** → **Add Environment Variable**:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api` |

**⚠️ IMPORTANT:** 
- Replace `YOUR-BACKEND-URL` with the actual URL from Step 2.C
- Example: `https://cpf-backend-abc123.onrender.com/api`
- **Must include `/api` at the end**

### C. Deploy Frontend

1. Click **Create Static Site**
2. Wait 5-10 minutes for build

---

## STEP 4: Link Backend to Frontend

The linking happens automatically through the `REACT_APP_API_URL` environment variable you set in Step 3.B.

**How it works:**
- Frontend makes API calls to: `process.env.REACT_APP_API_URL`
- This points to: `https://your-backend.onrender.com/api`
- Backend responds to requests from any origin (CORS enabled)

**Verify the link:**
1. Open your frontend URL: `https://cpf-frontend.onrender.com`
2. Try to login
3. Check browser console (F12) for any errors

---

## STEP 5: Test Your Application

1. Visit your frontend URL: `https://cpf-frontend.onrender.com`
2. Login with existing credentials
3. Test career assessment features

**If login fails:**
- Check Render Dashboard → Backend → Logs
- Verify `REACT_APP_API_URL` is correct
- Ensure MongoDB Network Access allows `0.0.0.0/0`

---

## 📋 Your Deployed URLs

After deployment, you'll have:

- **Frontend:** `https://cpf-frontend.onrender.com`
- **Backend:** `https://cpf-backend.onrender.com`
- **API Endpoint:** `https://cpf-backend.onrender.com/api`

---

## 🔄 Update Frontend URL After Backend Deployment

If you created the frontend before the backend was ready:

1. Go to Render Dashboard → **cpf-frontend**
2. Click **Environment** (left sidebar)
3. Find `REACT_APP_API_URL`
4. Click **Edit** → Update the value
5. Click **Save Changes**
6. Frontend will automatically redeploy

---

## ⚠️ Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Only 750 hours/month free (enough for 1 always-on service)

### Auto-Deploy on Git Push
- Push to `main` branch → Automatic redeployment
- View logs in Render Dashboard

### CORS
- Already configured in your backend
- No additional setup needed

---

## 🐛 Troubleshooting

### Backend won't start
**Check:** Render Dashboard → cpf-backend → Logs
- MongoDB connection error → Verify Network Access `0.0.0.0/0`
- Environment variable error → Check all 4 variables are set

### Frontend can't reach backend
**Check:** Browser Console (F12)
- CORS error → Backend CORS is misconfigured
- 404 error → `REACT_APP_API_URL` is wrong (missing `/api`?)
- Network error → Backend is sleeping (wait 60 seconds)

### Login doesn't work
**Check:**
1. MongoDB user credentials are correct
2. Backend logs show connection to MongoDB
3. `REACT_APP_API_URL` points to correct backend URL

---

## ✅ Deployment Complete!

Your application is now live:
- Users access: `https://cpf-frontend.onrender.com`
- Frontend calls: `https://cpf-backend.onrender.com/api`
- Data stored in: MongoDB Atlas

#### A. Deploy Backend Service

1. **Create Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click **"New +"** → exactly as shown:
     ```
     MONGODB_URI = mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0
     JWT_SECRET = choosekonguengineeringcollegeforbestfuture2026SecureKey
     PORT = 10000
     NODE_ENV = production
     ```
   
   **Copy-Paste Values:**
   - **Key:** `MONGODB_URI`  
     **Value:** `mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0`
   
   - **Key:** `JWT_SECRET`  
     **Value:** `choosekonguengineeringcollegeforbestfuture2026SecureKey`
   
   - **Key:** `PORT`  
     **Value:** `10000`
   
   - **Key:** `NODE_ENV`  
     **Value:** `production**Root Directory:** `backend`
     - **Environment:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

2. **Add Environment Variables**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add these variables:
     ```
     MONGODB_URI = your_mongodb_connection_string
     JWT_SECRET = your_secret_jwt_key_here
     PORT = 10000
     NODE_ENV = production
     ```

3. **Deploy Backend**
   - Click **"Create Web Service"**
   - Wait for deployment (5-10 minutes)
   - Copy the backend URL (e.g., `https://cpf-backend.onrender.com`)

#### B. Deploy Frontend Service
 this variable (update the URL after backend deploys):
     ```
     REACT_APP_API_URL = https://cpf-backend.onrender.com/api
     ```
   
   **Important:** Replace `cpf-backend` with your actual backend service name if different.
   
   You can find your backend URL in:
   - Render Dashboard → cpf-backend service → Copy the URL
   - Example: `https://cpf-backend-abc123.onrender.com`
   - Add `/api` at the end
     - **Name:** `cpf-frontend`
     - **Branch:** `main`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `build`

2. **Add Environment Variable**
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add:
     ```
     REACT_APP_API_URL = https://your-backend-url.onrender.com/api
     ```
     Replace with your actual backend URL from step A.3

3. **Configure Redirects/Rewrites**
   - Add a `_redirects` file in `frontend/public/`:
     ```
     /*    /index.html   200
     ```

4. **Deploy Frontend**
   - Click **"Create Static Site"**
   - Wait for build and deployment

---

## ✅ Post-Deployment Steps

### 1. Test Your Application

- Visit your frontend URL: `https://cpf-frontend.onrender.com`
- Try logging in with existing credentials
- Verify all features work correctly

### 2. Seed Database (If Needed)

If you need to seed questions:

1. Go to your backend service on Render
2. Click **"Shell"** tab
3. Run: `node seedQuestions.js`

### 3. Set Up Custom Domain (Optional)

1. Go to your frontend service settings
2. Click **"Custom Domain"**
3. Follow instructions to add your domain

---

## 🔄 Automatic Deployments

Render automatically redeploys your services when you push changes to your connected Git branch:

- Push to `main` branch → Automatic deployment
- View deployment logs in the Render dashboard

---

## 📊 Monitoring

### Check Service Health

- **Dashboard:** Monitor both services in the Render dashboard
- **Logs:** Click on each service to view real-time logs
- **Metrics:** View CPU, memory usage, and request metrics

   - Go to Render Dashboard → cpf-backend → Environment
   - Verify these values are set correctly:
     ```
     MONGODB_URI = mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0
     JWT_SECRET = choosekonguengineeringcollegeforbestfuture2026SecureKey
     PORT = 10000
     ```
   - Go to MongoDB Atlas → Network Access
   - Ensure **0.0.0.0/0** is in the IP Access List
- Services spin down after 15 minutes of inactivity
- First request after spin down may take 30-60 seconds
- 750 hours/month free (enough for one service)

---

## 🐛 Troubleshooting

### Backend Won't Start

1. **Check Environment Variables**
   - Verify `MONGODB_URI` is correct
   - Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

2. **Check Logs**
   - Go to backend service → **Logs**
   - Look for connection errors or missing dependencies

3. **Common Issues:**
   - MongoDB connection timeout → Check Network Access in Atlas
   - Port already in use → Render uses `PORT` env variable automatically
   - Missing dependencies → Clear cache and rebuild

### Frontend Build Fails

1. **Check Build Logs**
   - Look for npm install errors
   - Verify all dependencies are in `package.json`

2. **API URL Issues**
   - Ensure `REACT_APP_API_URL` is set correctly
   - Must include `/api` suffix
   - Must use `https://` for production

3. **Routing Issues**
   - Add `_redirects` file to `frontend/public/`
   - Content: `/*    /index.html   200`

### CORS Errors

If you see CORS errors in browser console:

1. Verify backend CORS configuration in `server.js`
2. Ensure frontend URL is allowed in CORS settings
3. Update CORS to allow your Render frontend domain

---

## 💰 Cost Estimate

**Free Tier Usage:**
- Backend: Free (with spin down)
- Frontend: Free
- MongoDB Atlas: Free (512MB storage)

**Paid Tier (Optional):**
- Backend: $7/month (always on)
- Frontend: Free
- MongoDB Atlas: Free tier is usually sufficient

---

## 🔐 Security Best Practices

1. ✅ Use environment variables for sensitive data
2. ✅ Never commit `.env` files to Git
3. ✅ Use strong JWT secrets (auto-generated on Render)
4. ✅ Enable MongoDB authentication
5. ✅ Restrict MongoDB network access when possible
6. ✅ Use HTTPS (automatic on Render)

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Render Node.js Guide](https://render.com/docs/deploy-node-express-app)
- [Render Static Sites](https://render.com/docs/static-sites)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

---

## 📞 Support

- **Render Support:** [https://render.com/docs/support](https://render.com/docs/support)
- **Community:** [Render Community Forum](https://community.render.com/)

---

## 🎉 Congratulations!

Your MBA Career Assessment Platform is now live on Render! 🚀

**Your URLs:**
- Frontend: `https://cpf-frontend.onrender.com`
- Backend: `https://cpf-backend.onrender.com`

Share your application and start helping students discover their ideal career paths!
