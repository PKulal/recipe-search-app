// List of common food items for auto-suggestions
const foodItems = [
    "Apple Pie", "Banana Bread", "Caesar Salad", "Chocolate Cake", "Cupcake",
    "Donut", "French Fries", "Hamburger", "Ice Cream", "Lasagna",
    "Mac and Cheese", "Mashed Potatoes", "Pancakes", "Pizza", "Salad",
    "Sandwich", "Spaghetti", "Sushi", "Tacos", "Waffles"
];

// Initialize Awesomplete with the list of food items
document.addEventListener("DOMContentLoaded", () => {
    new Awesomplete(document.getElementById("searchInput"), {
        list: foodItems,
        minChars: 1,
        maxItems: 5,
        autoFirst: true
    });
});

async function searchRecipe() {
    const query = document.getElementById('searchInput').value;
    console.log(`Search query: ${query}`);

    try {
        const response = await fetch(`http://localhost:3000/search?query=${query}`);
        if (!response.ok) {
            throw new Error('No recipes found');
        }

        const data = await response.json();
        console.log('Recipe Data:', data);

        const resultDiv = document.getElementById('recipeResult');
        resultDiv.innerHTML = `
            <h2>${data.title}</h2>
            <img src="${data.image}" alt="${data.title}" />
            <h3>Ingredients:</h3>
            <ul>${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}</ul>
            <a href="${data.youtubeLink}" target="_blank">Watch on YouTube</a>
        `;
    } catch (error) {
        console.error('Error:', error);
        const resultDiv = document.getElementById('recipeResult');
        resultDiv.innerHTML = `<p>${query} is not available in the list. Please try another item.</p>`;
    }
}
