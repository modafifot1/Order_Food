require("dotenv").config();
export const envVariables = {
  baseUrl: process.env.baseUrl || "http://localhost:3000",
  port: process.env.PORT || 3000,
  connectString:
    process.env.CONNSTR ||
    "mongodb+srv://016526585700:016526585700@cluster0.xzigp.mongodb.net/doancnpm?retryWrites=true&w=majority",
  jwtSecret: process.env.JWTSERCRET || "doanphanmem",
  googleClientId:
    process.env.clientId ||
    "40792845616-i0phd247ebg64f68q17f8vo055c9nk9r.apps.googleusercontent.com",
  googleClientSecret: process.env.clientSecret || "PpcvPGaH7kc78NneAOfaOoNq",
  perPage: 9 || process.env.perPage,
  cloud_name: process.env.CLOUD_NAME,
  api_key_cloud: process.env.API_KEY_CLOUD,
  api_secret_cloud: process.env.API_SECRET_CLOUD,
  nodeEnv: process.env.NODE_ENV || "development",
};
