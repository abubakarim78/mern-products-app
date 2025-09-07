import logger from "../utils/logger";


export const createProduct = async (req, res) => {
  try {
    // ... controller logic
    logger.info('Product created', { productId: product._id, userId: req.user.userId });
  } catch (error) {
    logger.error('Error creating product', { error: error.message, userId: req.user.userId });
    // ... error handling
  }
};