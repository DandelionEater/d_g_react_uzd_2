import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const RecipeDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  const fromFavorites = location.state?.fromFavorites ?? false;
  const currentPage = new URLSearchParams(location.search).get("page") || 1;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://dummyjson.com/recipes/${id}`);
        setRecipe(response.data);

        if (isAuthenticated) {
          const userResponse = await axios.get(`http://localhost:3000/users/${user.id}`);
          setIsLiked(userResponse.data.favoriteRecipes.includes(response.data.id));
        }
      } catch (err) {
        setError("Failed to fetch recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, user, isAuthenticated]);

  const toggleLike = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to favorite recipes!");
      return;
    }

    try {
      const userResponse = await axios.get(`http://localhost:3000/users/${user.id}`);
      const userData = userResponse.data;

      let updatedFavorites;
      if (isLiked) {
        updatedFavorites = userData.favoriteRecipes.filter(favId => favId !== recipe.id);
      } else {
        updatedFavorites = [...userData.favoriteRecipes, recipe.id];
      }

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        favoriteRecipes: updatedFavorites,
      });

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const goBack = () => {
    if (fromFavorites) {
      navigate("/favorites");
    } else {
      navigate(`/recipes?page=${currentPage}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>{recipe.name}</h2>
        <div className="row">
          <div className="col-md-4">
            <RecipeCard recipe={recipe} />
          </div>
          <div className="col-md-8">
            <h4>Ingredients:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>

            <h4>Instructions:</h4>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>

            <p><strong>Prep Time:</strong> {recipe.prepTimeMinutes} min</p>
            <p><strong>Cook Time:</strong> {recipe.cookTimeMinutes} min</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Calories per serving:</strong> {recipe.caloriesPerServing}</p>
            <p><strong>Meal Type:</strong> {recipe.mealType.join(", ")}</p>

            {isAuthenticated ? (
              <button onClick={toggleLike} className="btn btn-outline-danger">
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                {isLiked ? " Unfavorite" : " Favorite"}
              </button>
            ) : (
              <p className="text-muted">Log in to favorite recipes.</p>
            )}

            <button onClick={goBack} className="btn btn-primary ms-2">
              {fromFavorites ? "Back to Favorites" : "Back to Recipe List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
