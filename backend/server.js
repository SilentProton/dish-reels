const app = require('./src/app')
const dotenv = require('dotenv')
const connectDB = require('./src/db/db');

dotenv.config()
const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`);
})