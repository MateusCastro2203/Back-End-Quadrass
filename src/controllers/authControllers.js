const express = require ('express');

const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', async(req, res) => {
    const { email } = req.body;
    try{
        if(await User.findOne({email}))
            return res.status(400).send({error: 'User already exist'})
        
        const user = await User.create(req.body);

        User.password = undefined;

        return res.send({ user });
    }catch{
        return res.status(400).send({ error: 'Registration failed' })
    }
});


router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error: 'User  not Found'})
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error:'Ivalid password'})
    
    User.password = undefined;

    res.send({user})
})

module.exports = app => app.use('/auth', router);