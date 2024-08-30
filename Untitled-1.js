const mongoose = require('mongoose');

// const connectToMongoDB = async () => {
//   try {
//     const mongoURI = 'mongodb+srv://kallurinaveenkumar:naveensrmap@kalluri1.brq3int.mongodb.net/Naveendb?retryWrites=true&w=majority';
//     await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('Connected to MongoDB');

//     const foodCollection = mongoose.connection.db.collection('food_items');
//     const categoryCollection = mongoose.connection.db.collection('Categories');

//     const [foodData, foodCategory] = await Promise.all([
//       foodCollection.find({}).toArray(),
//       categoryCollection.find({}).toArray(),
//     ]);

//     return { foodData, foodCategory };
//   } catch (error) {
//     console.error('Failed to connect to MongoDB', error);
//     throw error;
//   }
// };

// // Call the connectToMongoDB function
// connectToMongoDB()
//   .then(({ foodData, foodCategory }) => {
//     // Once the connection is established and data is fetched successfully
//     console.log('Food Data:', foodData);
//     console.log('Food Category:', foodCategory);
//   })
//   .catch(error => {
//     // If there's an error while connecting to MongoDB or fetching data
//     console.error('Error:', error);
//   });
