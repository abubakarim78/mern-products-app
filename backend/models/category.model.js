import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,                                // No duplicate category names
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  slug: {
    type: String,
    unique: true                                 // Auto-generated from name
  },
  
  image: {
    type: String,                                // Category banner image URL
    default: 'https://via.placeholder.com/400x200'
  },
  
  parent: {
    type: mongoose.Schema.Types.ObjectId,        // For subcategories
    ref: 'Category',
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  sortOrder: {
    type: Number,                                // For custom ordering
    default: 0
  },
  
  productCount: {
    type: Number,                                // Cache product count for performance
    default: 0
  }
  
}, {
  timestamps: true
});

// Create slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

export default mongoose.model('Category', categorySchema);