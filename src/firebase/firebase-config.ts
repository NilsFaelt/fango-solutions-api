const firebaseConfig = {
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.PROJECT_ID,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  // databaseUrl: process.env.CLIENT_EMAIL,
};

export default firebaseConfig;
