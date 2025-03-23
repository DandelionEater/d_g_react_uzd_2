import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/users/${user.id}`);
        const recipeIds = userResponse.data.favoriteRecipes || [];

        const recipePromises = recipeIds.map(id =>
          axios.get(`https://dummyjson.com/recipes/${id}`).then(res => res.data)
        );

        const recipes = await Promise.all(recipePromises);
        setFavoriteRecipes(recipes);
      } catch (err) {
        setError("Failed to load favorite recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, navigate, user.id]);

  const removeFavorite = async (recipeId) => {
    try {
      const updatedFavorites = favoriteRecipes.filter(recipe => recipe.id !== recipeId);
      setFavoriteRecipes(updatedFavorites);

      const updatedUser = { ...user, favoriteRecipes: updatedFavorites.map(r => r.id) };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      const response = await axios.patch(`http://localhost:3000/users/${user.id}`, {
        favoriteRecipes: updatedUser.favoriteRecipes,
      });

      if (response.status === 200) {
        await fetchFavorites();
      } else {
        console.error("Failed to update favorites on the server.");
        setFavoriteRecipes([...favoriteRecipes]);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const toggleLike = async (recipeId) => {
    if (!isAuthenticated) {
      alert("You must be logged in to favorite recipes!");
      return;
    }

    try {
      const userResponse = await axios.get(`http://localhost:3000/users/${user.id}`);
      const userData = userResponse.data;

      const updatedFavorites = userData.favoriteRecipes.filter(favId => favId !== recipeId);

      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        favoriteRecipes: updatedFavorites,
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Your Favorite Recipes</h2>
        {favoriteRecipes.length === 0 ? (
          <p>No favorite recipes yet.</p>
        ) : (
          <div className="row">
            {favoriteRecipes.map((recipe) => (
              <div className="col-md-4 mb-3 position-relative" key={recipe.id}>
                <RecipeCard recipe={recipe} fromFavorites={true} />
                <button
                  className="btn btn-danger position-absolute bottom-0 end-0 m-2"
                  style={{ zIndex: 10 }}
                  onClick={() => removeFavorite(recipe.id)}
                >
                  Remove from Favorites
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
