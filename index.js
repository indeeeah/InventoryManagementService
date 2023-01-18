/**
 * Created by SooMinKim on 2023-01-04
 */

const app = require('./src/app');
const config = require('./config');

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`\n : (http://localhost:${PORT}) Server is successfully started. \n`)
});