module.exports = {
  apps: [
    {
      name: "bgv-backend",
      script: "src/server.js",
      cwd: "/home/ec2-user/bgv-platform/server",

      instances: 1,
      autorestart: true,
      watch: false,

      env: {
        NODE_ENV: "production",
        PORT: 5000,

        // 🔐 Firebase
        FIREBASE_SERVICE_ACCOUNT_PATH:
          "/home/ec2-user/secure/serviceAccountKey.json",

        // 🗄️ MongoDB (USE EXACT CASE!)
        MONGO_URI:
          "mongodb+srv://poorvipoorvi234_db_user:r1uqEk5wLQ9CwhaX@cluster0.fcx4wjq.mongodb.net/Cluster0?retryWrites=true&w=majority"
      }
    }
  ]
};
