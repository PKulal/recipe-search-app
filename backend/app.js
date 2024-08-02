// Import required modules
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

// Initialize the app
const app = express();
const port = 3000;

// Use CORS to allow cross-origin requests
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the search endpoint
app.get('/search', async (req, res) => {
    const query = req.query.query;
    console.log(`Search query: ${query}`);

    try {
        // Fetch recipe data from an external API
        const recipeResponse = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=YOUR-API-KEY`);
        console.log('Recipe Response:', recipeResponse.data);

        if (recipeResponse.data.results.length === 0) {
            return res.status(404).send('No recipes found');
        }

        // Find the exact match if available
        const exactMatch = recipeResponse.data.results.find(recipe => recipe.title.toLowerCase().includes(query.toLowerCase())) || recipeResponse.data.results[0];
        console.log('Exact Match Recipe:', exactMatch);

        // Fetch recipe details
        const detailsResponse = await axios.get(`https://api.spoonacular.com/recipes/${exactMatch.id}/information?apiKey=YOUR-API-KEY`);
        const details = detailsResponse.data;

        // Structure the response
        const result = {
            title: details.title,
            image: details.image,
            ingredients: details.extendedIngredients.map(ingredient => ingredient.original),
            youtubeLink: `https://www.youtube.com/results?search_query=${details.title} recipe`
        };

        // Send the result back to the frontend
        res.json(result);
    } catch (error) {
        console.error('Error fetching recipe data:', error);
        res.status(500).send('Error fetching recipe data');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
