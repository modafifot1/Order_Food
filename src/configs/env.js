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
  cloud_name: process.env.CLOUD_NAME || "dacnpm17n2",
  api_key_cloud: process.env.API_KEY_CLOUD || 232775572756875,
  api_secret_cloud:
    process.env.API_SECRET_CLOUD || "bfBoZeZCJVFov7NhKJIqsP9W8M0",
  nodeEnv: process.env.NODE_ENV || "development",
  nodemailerEmail: process.env.nodemailerEmail || "dacnpm17n2@gmail.com",
  nodemailerPassword: process.env.nodemailerPassword || "qweQWE!@#",
  API_GOOGLEMAP_KEY:
    process.env.api_googlemap_key || "AIzaSyDTlNkVmEcfZ5ICLzfmE48b8TWulg7G5Hs",
  my_address: "62/07, nguyen luong bang, hoa khanh, lien chieu, da nang",
};
