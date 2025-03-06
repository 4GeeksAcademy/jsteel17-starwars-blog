import React, { createContext, useState, useEffect } from "react";

export const StarWarsContext = createContext();

const StarWarsProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [people, setPeople] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        fetchData("people", setPeople);
        fetchData("vehicles", setVehicles);
        fetchData("planets", setPlanets);
    }, []);

    const fetchData = async (category, setter) => {
        try {
            const response = await fetch(`https://www.swapi.tech/api/${category}`);
            const data = await response.json();
            setter(data.results);
        } catch (error) {
            console.error(`Error fetching ${category}:`, error);
        }
    };

    const toggleFavorite = (item) => {
        setFavorites((prev) =>
            prev.some((fav) => fav.uid === item.uid)
                ? prev.filter((fav) => fav.uid !== item.uid)
                : [...prev, item]
        );
    };

    return (
        <StarWarsContext.Provider value={{ people, vehicles, planets, favorites, toggleFavorite }}>
            {children}
        </StarWarsContext.Provider>
    );
};

export default StarWarsProvider;