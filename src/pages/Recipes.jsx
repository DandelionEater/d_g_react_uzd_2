import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FetchRecipeData from "../components/FetchRecipeData";
import RecipeCard from "../components/RecipeCard";

const Recipes = () => {
  const { isAuthenticated } = useAuth();
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentPageFromUrl = new URLSearchParams(location.search).get("page") || 1;

  const [currentPage, setCurrentPage] = useState(Number(currentPageFromUrl));
  const recipesPerPage = 5;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`?page=${pageNumber}`, { replace: true });
  };

  useEffect(() => {
    setCurrentPage(Number(currentPageFromUrl));
  }, [location.search]);

  if (!isAuthenticated) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center">
          <h2>Access Denied</h2>
          <p>This page is restricted to registered users only.</p>
          <p>Please <Link to="/login">Login</Link> to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Recipes</h2>
        <div className="text-center">
          <h6>Press on the recipe card to see more detailed information</h6>
        </div>

        <FetchRecipeData>
          {(recipes) => {
            const indexOfLastRecipe = currentPage * recipesPerPage;
            const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
            const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

            const pageNumbers = [];
            for (let i = 1; i <= Math.ceil(recipes.length / recipesPerPage); i++) {
              pageNumbers.push(i);
            }

            return (
              <>
                <div className="row d-flex justify-content-center">
                  {currentRecipes.map((recipe) => (
                    <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
                      <RecipeCard recipe={recipe} onViewDetails={(id) => console.log("View details for recipe", id)} />
                    </div>
                  ))}
                </div>

                <nav>
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className="page-link"
                        disabled={currentPage === 1}
                      >
                        Atgal
                      </button>
                    </li>

                    {pageNumbers.map((number) => (
                      <li key={number} className="page-item">
                        <button
                          onClick={() => paginate(number)}
                          className={`page-link ${currentPage === number ? "active" : ""}`}
                        >
                          {number}
                        </button>
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === pageNumbers.length ? "disabled" : ""}`}>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className="page-link"
                        disabled={currentPage === pageNumbers.length}
                      >
                        Pirmyn
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            );
          }}
        </FetchRecipeData>
      </div>
    </div>
  );
};

export default Recipes;
