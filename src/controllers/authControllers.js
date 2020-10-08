const express = require ('express');

const User = require('../models/user');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json');

const router = express.Router();


function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    });
}

router.post('/register', async(req, res) => {
    const { email } = req.body;
    try{
        if(await User.findOne({email}))
            return res.status(400).send({error: 'User already exist'})
        
        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ 
            user,
            token: generateToken({id: user.id}) 
        });
    }catch{
        return res.status(400).send({ error: 'Registration failed' })
    }
});

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email}).select('+password');

    if(!user)
        return res.status(400).send({error: 'User not Found'})
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error:'Ivalid password'})
    
    user.password = undefined;

    res.send({
        user, 
        token: generateToken({id: user.id}),
    })
})



module.exports = app => app.use('/auth', router);