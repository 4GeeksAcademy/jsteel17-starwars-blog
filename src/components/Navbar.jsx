import React, { useContext } from "react";
import { StarWarsContext } from "../store/StarWarsContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const { favorites } = useContext(StarWarsContext);

    return (
        <nav className="navbar navbar-light bg-light">
            <Link to="/" className="navbar-brand mx-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Star_Wars_Logo.svg" alt="Star Wars" width="100"/>
            </Link>
            <div className="dropdown mx-3">
                <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    Favorites ({favorites.length})
                </button>
                <ul className="dropdown-menu">
                    {favorites.length === 0 ? <li className="dropdown-item">No favorites</li> : 
                        favorites.map((fav, index) => <li key={index} className="dropdown-item">{fav.name}</li>)}
                </ul>
            </div>
        </nav>
    );
};