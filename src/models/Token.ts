
/**
 * @author EDC: Oluwatobi Adeoye. <oluwatobiadeoye18@gmail.com>
*/
import mongoose, { Schema } from 'mongoose';

const tokenSchema = new mongoose.Schema({
    _userId: { 
        type: Schema.Types.ObjectId, 
        required: true, 
        ref: 'User' 
    },
    token: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now, 
        expires: 43200 
    }
});

module.exports = mongoose.model("Token", tokenSchema);