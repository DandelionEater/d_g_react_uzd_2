import React, { useState } from "react";
import RecipeCard from "./RecipeCard";

const RecipeList = ({ recipes }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 5;

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(recipes.length / recipesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      <div className="container mt-4">
        <div className="row d-flex justify-content-center">
          {currentRecipes.map((recipe) => (
            <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <RecipeCard recipe={recipe} onViewDetails={(id) => console.log("View details for recipe", id)} />
            </div>
          ))}
        </div>
      </div>

      <nav>
        <ul className="pagination justify-content-center">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default RecipeList;
