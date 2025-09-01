import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: true,
        minLength: [50, 'The minimum length of the description must be more than 50 characters']
    },
    price: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    stock: {
        type: Number,
        min: 0,
        default: 0
    },
    imageUrl: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
    }
}, {
      timestamps: true                               // Why? Track when products were added/updated
})

const productModel = new mongoose.model("Product", productSchema)

export default productModel;