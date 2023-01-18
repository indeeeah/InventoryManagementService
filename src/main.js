const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 8002;

const userRouter = express.Router();

// app.use('/', async (req, res, next) => {
//     console.log('Middleware 1');

//     const fileContent = await fs.promises.readFile('.gitignore');
//     const requestDate = new Date();
//     req.requestDate = requestDate;
//     req.fileContent = fileContent;
//     next();
// });

// app.use((req, res) => {
//     console.log('Middleware 2');
//     res.send(`Hello, express ${req.requestDate}, ${req.fileContent}`);
// })

userRouter.get('/', (req, res) => {
    res.send('Root - GET')
})

const USERS = {
    3 : {
        nickname: 'foo',
    }
}

userRouter.param('id', (req, res, next, value) => {
    console.log('id parameter : ', value);
    req.user = USERS[value];
    next();
})

userRouter.get('/:id', (req, res) => {
    console.log('userRouter ger Id');
    res.send(req.user)
})

userRouter.post('/', (req, res) => {
    res.send('User registered');
})

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`The Express server is listening at port : ${PORT}`);
});