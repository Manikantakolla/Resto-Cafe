const mongoose = require('mongoose');

const connectToMongoDB = async () => {
  try {
    const mongoURI = 'mongodb+srv://kallurinaveenkumar:manikantakolla@kalluri1.brq3int.mongodb.net/?retryWrites=true&w=majority&appName=Kalluri1';
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const foodCollection = mongoose.connection.db.collection('food_items');
    const categoryCollection = mongoose.connection.db.collection('Categories');

    const [foodData, foodCategory] = await Promise.all([
      foodCollection.find({}).toArray(),
      categoryCollection.find({}).toArray(),
    ]);

    return { foodData, foodCategory };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

module.exports = connectToMongoDB;
