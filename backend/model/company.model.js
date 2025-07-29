import mongooose from 'mongoose';
const Company= new mongooose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,


        unique: true,

    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    domain:{
        type: String,
        required: true,
    }
});
export default mongooose.model('Company', Company);

   