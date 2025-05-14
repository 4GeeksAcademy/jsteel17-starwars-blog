import React, { createContext, useState, useEffect } from "react";

export const StarWarsContext = createContext();

// Cache mechanism to reduce API calls
const localStorageCache = {
  get: (key) => {
    try {
      const cachedData = localStorage.getItem(key);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Check if cache is still valid (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  },
  set: (key, data) => {
    try {
      const cacheEntry = JSON.stringify({
        data,
        timestamp: Date.now()
      });
      localStorage.setItem(key, cacheEntry);
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  }
};

const StarWarsProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [people, setPeople] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Cache for details to prevent repeated API calls
    const [detailsCache, setDetailsCache] = useState({});

    useEffect(() => {
        // Load favorites from localStorage if available
        const storedFavorites = localStorage.getItem('starWarsFavorites');
        if (storedFavorites) {
            try {
                setFavorites(JSON.parse(storedFavorites));
            } catch (error) {
                console.error("Error parsing stored favorites:", error);
            }
        }
        
        // Load all data with retries and delay between requests
        const loadAllData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                await Promise.all([
                    loadCategoryWithRetry('people', setPeople),
                    // Add delays to prevent rate limiting
                    new Promise(resolve => setTimeout(() => {
                        loadCategoryWithRetry('vehicles', setVehicles).then(resolve);
                    }, 1000)),
                    new Promise(resolve => setTimeout(() => {
                        loadCategoryWithRetry('planets', setPlanets).then(resolve);
                    }, 2000))
                ]);
                setLoading(false);
            } catch (error) {
                console.error("Error loading Star Wars data:", error);
                setError("Failed to load data. The Force is not strong with this connection.");
                setLoading(false);
            }
        };
        
        loadAllData();
        
        // Also try to load cache from localStorage
        try {
            const cachedDetails = localStorage.getItem('starWarsDetailsCache');
            if (cachedDetails) {
                setDetailsCache(JSON.parse(cachedDetails));
            }
        } catch (error) {
            console.error("Error loading details cache:", error);
        }
    }, []);

    // Save favorites to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('starWarsFavorites', JSON.stringify(favorites));
    }, [favorites]);
    
    // Save details cache to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('starWarsDetailsCache', JSON.stringify(detailsCache));
    }, [detailsCache]);

    const loadCategoryWithRetry = async (category, setter, retries = 3) => {
        // Try to get from cache first
        const cachedData = localStorageCache.get(`starwars_${category}`);
        if (cachedData) {
            console.log(`Loading ${category} from cache`);
            setter(cachedData);
            return;
        }
        
        // If not in cache, fetch from API with retries
        let lastError;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                // Add delay between retries to help with rate limiting
                if (attempt > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
                
                const response = await fetch(`https://www.swapi.tech/api/${category}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${category}: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.results) {
                    // Cache the successful result
                    localStorageCache.set(`starwars_${category}`, data.results);
                    setter(data.results);
                    return;
                } else {
                    throw new Error(`Invalid data format for ${category}`);
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed for ${category}:`, error);
                lastError = error;
            }
        }
        
        // If we get here, all retries failed
        throw lastError || new Error(`Failed to load ${category} after ${retries} attempts`);
    };

    // Function to get details with caching
    const getDetails = async (type, id) => {
        const cacheKey = `${type}_${id}`;
        
        // Check if already in memory cache
        if (detailsCache[cacheKey]) {
            return detailsCache[cacheKey];
        }
        
        // Try to fetch with retries
        let lastError;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                // Add delay between retries to help with rate limiting
                if (attempt > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
                
                const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${type} details: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.result && data.result.properties) {
                    // Update cache
                    setDetailsCache(prev => ({
                        ...prev,
                        [cacheKey]: data.result
                    }));
                    return data.result;
                } else {
                    throw new Error(`Invalid data format for ${type} details`);
                }
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed for ${type} details:`, error);
                lastError = error;
            }
        }
        
        // If we get here, all retries failed
        throw lastError || new Error(`Failed to load ${type} details after 3 attempts`);
    };

    const toggleFavorite = (item) => {
        if (!item.type) {
            console.warn("Adding favorite without type information:", item);
        }
        
        setFavorites((prev) =>
            prev.some((fav) => fav.uid === item.uid)
                ? prev.filter((fav) => fav.uid !== item.uid)
                : [...prev, item]
        );
    };

    return (
        <StarWarsContext.Provider value={{ 
            people, 
            vehicles, 
            planets, 
            favorites, 
            toggleFavorite, 
            loading, 
            error,
            getDetails 
        }}>
            {children}
        </StarWarsContext.Provider>
    );
};

export default StarWarsProvider;