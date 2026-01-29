# 🔑 Render Environment Variables - Copy & Paste Guide

## 📋 Quick Reference for Render Deployment

Use these exact values when setting up environment variables on Render.

---

## 🖥️ Backend Service Environment Variables

When creating your **cpf-backend** service on Render, add these environment variables:

### Variable 1: MONGODB_URI
```
mongodb+srv://nisar:nisar%402004@cluster0.7q9px.mongodb.net/CPF?appName=Cluster0
```

### Variable 2: JWT_SECRET
```
choosekonguengineeringcollegeforbestfuture2026SecureKey
```

### Variable 3: PORT
```
10000
```

### Variable 4: NODE_ENV
```
production
```

---

## 🌐 Frontend Service Environment Variables

When creating your **cpf-frontend** service on Render, add this environment variable:

### Variable 1: REACT_APP_API_URL

**After your backend is deployed**, use your actual backend URL:

```
https://cpf-backend.onrender.com/api
```

**⚠️ Important Notes:**
- Replace `cpf-backend` with your actual Render backend service name
- Make sure to include `/api` at the end
- Find your backend URL in Render Dashboard → Backend Service → URL

**Example URLs:**
- If backend URL is: `https://cpf-backend-abc123.onrender.com`
- Then use: `https://cpf-backend-abc123.onrender.com/api`

---

## 📝 How to Add Environment Variables on Render

### Method 1: During Service Creation
1. When creating the service, click **"Advanced"**
2. Click **"Add Environment Variable"**
3. Enter the **Key** (variable name)
4. Copy and paste the **Value** from above
5. Repeat for each variable

### Method 2: After Service Creation
1. Go to your service in Render Dashboard
2. Click **"Environment"** tab on the left
3. Click **"Add Environment Variable"**
4. Enter the **Key** and **Value**
5. Click **"Save Changes"**

---

## ✅ Verification Checklist

Before deploying, verify:

- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] MongoDB Atlas user `nisar` exists with password `nisar@2004`
- [ ] All 4 backend environment variables are set
- [ ] Frontend `REACT_APP_API_URL` points to your actual backend URL
- [ ] Backend URL includes `/api` at the end
- [ ] Both services are connected to the same Git repository

---

## 🔐 Security Note

**For Production Environment:**
Consider these security improvements after initial deployment:

1. **Create a new MongoDB user** with a stronger password
2. **Generate a stronger JWT secret** using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Restrict MongoDB Network Access** to specific Render IP ranges
4. **Use environment-specific configurations** for different deployments

---

## 📞 Need Help?

If you encounter issues:
1. Check Render Dashboard → Service → Logs
2. Verify all environment variables are spelled correctly
3. Ensure no extra spaces in values
4. Review [RENDER_DEPLOYMENT_GUIDE.md](RENDER_DEPLOYMENT_GUIDE.md) for troubleshooting

---

**Ready to Deploy?** Copy these values and follow the [QUICK_START.md](QUICK_START.md) guide! 🚀
