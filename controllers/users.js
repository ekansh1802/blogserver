import Users from '../models/users.js';
import blogMessage from '../models/blogMessage.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



export const registerUser = async (req, res) => {
    const { email, password, username, profile } = req.body;

    try{
        //Checking if user already registered
        const existingUser = await Users.findOne({ email });
        if(existingUser){
            res.status(404).json({ message: 'Already registered' });
        }

        //Registering up the user
        //Hash password takes 2 arguements. 1st = password to be hashed and 2nd = difficulty level
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await Users.create({ email: email, password: hashedPassword, username: username, profile: profile });
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: '1h' });
        res.status(200).json({ result: result, token });


    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        //Checking if user present or not
        const existingUser = await Users.findOne({ email });
        if(!existingUser){
            return res.status(404).json({ message: 'User is not available' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(404).json({ message: 'Invalid Credentials' });
        }

        //To generate jwt token 1st arguement = email and id and 2nd arguement = a secret string and 3rd = options object
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h"});
        res.status(200).json({ result: existingUser, token });
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const getUser = async (req, res) => {
    const { id: _id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            res.status(404).send( "No user with this ID ");
        }
        const user = await Users.findById(_id);
        if(user){
            res.status(200).json(user);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const updateUser = async (req, res) => {
    const { username, email, password } = req.body; // Updated User
    const { id: _id } = req.params;

    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            return res.status(404).send( "No user with this ID ");
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedUser = await Users.findByIdAndUpdate(_id, { username: username, email: email, password: hashedPassword }, { new: true } );
        res.status(200).json(updatedUser);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}

export const deleteUser = async (req, res) => {
    const { id: _id } = req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(_id)){
            res.status(404).send( "No user with this ID ");
        }
        await Users.findByIdAndRemove(_id);
        res.json({ message: 'User deleted successfully' });
        await blogMessage.findOneAndDelete({ userId: `${_id}`}, function (err) {
            if(err) console.log(err);
            console.log(`Post with userId ${_id} deleted`);
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Some error has occurred' });
    }
}