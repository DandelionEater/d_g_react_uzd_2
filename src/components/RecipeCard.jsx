import React from "react";
import { Link, useLocation } from "react-router-dom";

const RecipeCard = ({ recipe, fromFavorites = false }) => {
  const location = useLocation();
  const currentPage = new URLSearchParams(location.search).get("page") || 1;

  return (
    <div
      className="card"
      style={{
        width: "100%",
        margin: "10px",
        height: "100%",
        position: "relative",
        border: "1px solid #ddd",
        background: "#fff",
        padding: "0",
        cursor: "pointer",
      }}
    >
      <Link
        to={{
          pathname: `/recipes/${recipe.id}`,
          search: `?page=${currentPage}`,
        }}
        state={fromFavorites ? { fromFavorites: true } : {}}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          height: "100%",
        }}
      >
        <img
          src={recipe.image}
          className="card-img-top"
          alt={recipe.name}
          style={{
            objectFit: "cover",
            height: "200px",
            width: "100%",
          }}
        />
        <div className="card-body">
          <h5
            className="card-title"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
              textOverflow: "ellipsis",
            }}
          >
            {recipe.name}
          </h5>
          <p className="card-text">⭐ {recipe.rating} ({recipe.reviewCount} reviews)</p>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;
