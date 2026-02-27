# Deployment Guide: Kumbh 2027 Microservices App

To deploy this Turborepo (Micro-Frontends + Microservices) to an open platform for the general public, you need to host both the **frontend static files** and the **backend Node.js servers**. 

Here is the standard approach using popular, free-tier friendly platforms:

## 1. Deploying the Micro-Frontends (Vite / React)
The frontend (`host-app` and `map-mfe`) can be hosted on Content Delivery Networks (CDNs) designed for static sites. We recommend **Vercel**, **Netlify**, or **AWS S3 + CloudFront**.

*Note: Since they use Module Federation, the `host-app` needs to securely know the public URL of the `map-mfe`.*

**Steps:**
1. **Deploy `map-mfe` first:**
   - Push your code to a GitHub repository.
   - Connect the repository to Vercel/Netlify.
   - Set the Build Command to `cd apps/map-mfe && npm run build`.
   - Set the Output Directory to `apps/map-mfe/dist`.
   - After deploying, you will receive a public URL (e.g., `https://map-mfe-kumbh.vercel.app`).
   
   *(Note: The map-mfe bundle now includes several robust sub-modules exposing critical Kumbh functions: Parking Area, Laser Show, Akhara Registration, Facilities Layout, Food Vendor Registration, Sanitary Worker Registration, Medical Assistance, Lost & Found, Ration Management, and Donation Management. Building this app will compile all of these components into the federated `remoteEntry.js` file).*
   
2. **Update the `host-app` Config:**
   - Open `apps/host-app/vite.config.js`.
   - Update the `remotes` section to point to the new public URL:
     ```javascript
     remotes: {
        map_mfe: 'https://map-mfe-kumbh.vercel.app/assets/remoteEntry.js',
     }
     ```
3. **Deploy `host-app`:**
   - Create a new site on Vercel/Netlify.
   - Set the Build Command to `cd apps/host-app && npm run build`.
   - Set the Output Directory to `apps/host-app/dist`.
   - Your frontend will now be publicly accessible!

---

## 2. Deploying the Microservices (Express.js)
The backend services (`api-gateway`, `places-service`, `ai-media-service`) require a Node.js runtime. Platforms like **Render**, **Railway**, or **Heroku** are perfect for this.

**Steps:**
1. **Deploy `places-service` and `ai-media-service`:**
   - On Render/Railway, create two new "Web Services".
   - Set the root directory for each to `services/places-service` and `services/ai-media-service`.
   - Set the Build Command to `npm install`.
   - Set the Start Command to `node index.js`.
   - Note the public URLs generated for both.

2. **Update and Deploy the `api-gateway`:**
   - Open `services/api-gateway/index.js`.
   - Update the Proxy targets from `http://localhost:X` to the public URLs you just got for your services.
   - Create a third "Web Service" on your hosting platform pointing to `services/api-gateway`.
   - Deploy it using `npm install` and `node index.js`.

---

## 3. Final Integration
Once the `api-gateway` is publicly available (e.g., `https://kumbh-api-gateway.onrender.com`), you need to update your frontend applications to fetch data from this new URL instead of `http://localhost:4000`.

- Open `apps/host-app/src/App.jsx` and `apps/map-mfe/src/MapComponent.jsx`.
- Change any `fetch('http://localhost:4000/...')` calls to use your newly deployed `api-gateway` URL.
- Commit these changes, and your frontend hosting provider will automatically redeploy the client applications!

Your application is now globally distributed and accessible to the public!
