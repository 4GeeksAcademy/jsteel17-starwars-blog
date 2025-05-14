import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { StarWarsContext } from "../store/StarWarsContext";

// Image mappings for Star Wars characters, vehicles, and planets
const imageMap = {
  people: {
    '1': 'https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_fb34a1ff.jpeg', // Luke Skywalker
    '2': 'https://lumiere-a.akamaihd.net/v1/images/c-3po-main_417a2902.jpeg', // C-3PO
    '3': 'https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_86916bb6.jpeg', // R2-D2
    '4': 'https://lumiere-a.akamaihd.net/v1/images/Darth-Vader_6bda9114.jpeg', // Darth Vader
    '5': 'https://lumiere-a.akamaihd.net/v1/images/leia-organa-feature-image_d0f5e953.jpeg', // Leia Organa
    '6': 'https://lumiere-a.akamaihd.net/v1/images/owen-lars-main_08c717c8.jpeg', // Owen Lars
    '7': 'https://lumiere-a.akamaihd.net/v1/images/databank_berulars_01_169_68101518.jpeg', // Beru Lars
    '8': 'https://lumiere-a.akamaihd.net/v1/images/r5-d4_main_image_7d5f078e.jpeg', // R5-D4
    '9': 'https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg', // Biggs Darklighter
    '10': 'https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_95f3a1a6.jpeg', // Obi-Wan Kenobi
    // Default image for other people
    'default': 'https://lumiere-a.akamaihd.net/v1/images/star-wars-character_25fitdr3.jpeg'
  },
  vehicles: {
    '4': 'https://lumiere-a.akamaihd.net/v1/images/sandcrawler-main_22404c03.jpeg', // Sand Crawler
    '6': 'https://lumiere-a.akamaihd.net/v1/images/databank_rebelsnowspeeder_01_169_5d670434.jpeg', // T-16 Skyhopper
    '7': 'https://lumiere-a.akamaihd.net/v1/images/X-34-Landspeeder_8cfe5e72.jpeg', // X-34 Landspeeder
    '8': 'https://lumiere-a.akamaihd.net/v1/images/tie-fighter-main_01e5f79a.jpeg', // TIE/LN Starfighter
    '14': 'https://lumiere-a.akamaihd.net/v1/images/snowspeeder_ef2f9334.jpeg', // Snowspeeder
    '16': 'https://lumiere-a.akamaihd.net/v1/images/tempest-runner-main_9258f24d.jpeg', // TIE Bomber
    '18': 'https://lumiere-a.akamaihd.net/v1/images/AT-AT_89d0105f.jpeg', // AT-AT
    '19': 'https://lumiere-a.akamaihd.net/v1/images/AT-ST-main_f315b094.jpeg', // AT-ST
    '20': 'https://lumiere-a.akamaihd.net/v1/images/databank_stormtrooperspeederbiketransport_79544f0d.jpeg', // Storm IV Twin-Pod Cloud Car
    // Default image for other vehicles
    'default': 'https://lumiere-a.akamaihd.net/v1/images/resistance-a-wing-main_11df4b87.jpeg'
  },
  planets: {
    '1': 'https://lumiere-a.akamaihd.net/v1/images/tatooine-main_9542b896.jpeg', // Tatooine
    '2': 'https://lumiere-a.akamaihd.net/v1/images/databank_alderaan_01_169_4a5264e2.jpeg', // Alderaan
    '3': 'https://lumiere-a.akamaihd.net/v1/images/databank_yavin4_01_169_b6945e20.jpeg', // Yavin IV
    '4': 'https://lumiere-a.akamaihd.net/v1/images/Hoth_d074d307.jpeg', // Hoth
    '5': 'https://lumiere-a.akamaihd.net/v1/images/Dagobah_890df592.jpeg', // Dagobah
    '6': 'https://lumiere-a.akamaihd.net/v1/images/databank_bespin_01_169_c533d6c6.jpeg', // Bespin
    '7': 'https://lumiere-a.akamaihd.net/v1/images/databank_endor_01_169_68ba9bdc.jpeg', // Endor
    '8': 'https://lumiere-a.akamaihd.net/v1/images/databank_naboo_01_169_6cd7e1e0.jpeg', // Naboo
    '9': 'https://lumiere-a.akamaihd.net/v1/images/databank_coruscant_01_169_4d4b26cf.jpeg', // Coruscant
    '10': 'https://lumiere-a.akamaihd.net/v1/images/kamino-main_3001369e.jpeg', // Kamino
    // Default image for other planets
    'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_felucia_01_169_2070f16a.jpeg'
  }
};

const Details = () => {
    const { type, id } = useParams();
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const { toggleFavorite, favorites } = useContext(StarWarsContext);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`);
                
                // Handle API failure gracefully
                if (!response.ok) {
                    console.log(`API request failed for ${type}/${id}, but continuing with image only`);
                    setLoading(false);
                    return;
                }
                
                const data = await response.json();
                setDetails({
                    ...data.result,
                    isFavorite: favorites.some(fav => fav.uid === id)
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching details:", error);
                setLoading(false);
            }
        };
        
        fetchDetails();
    }, [id, type, favorites]);

    // Handle image load errors
    const handleImageError = () => {
        setImageError(true);
    };

    // Get image from our mapping or use default
    const getImageUrl = () => {
        // If we had an image error, use a type-specific default
        if (imageError) {
            return imageMap[type]?.default || 'https://lumiere-a.akamaihd.net/v1/images/star-wars-character_25fitdr3.jpeg';
        }
        
        // Try direct ID match from our mapping
        const typeImages = imageMap[type] || {};
        if (typeImages[id]) {
            return typeImages[id];
        }
        
        // Use type default
        return typeImages.default || 'https://lumiere-a.akamaihd.net/v1/images/star-wars-character_25fitdr3.jpeg';
    };

    if (loading && !imageError) {
        return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;
    }

    // Handle the case where details weren't loaded but we have an image
    const showPlaceholderDetails = !details && !loading;

    return (
        <div className="container mt-4">
            <div className="card mb-3">
                <div className="row g-0">
                    <div className="col-md-5">
                        <img 
                            src={getImageUrl()} 
                            className="img-fluid rounded-start" 
                            alt={details?.properties?.name || `Star Wars ${type}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={handleImageError}
                        />
                    </div>
                    <div className="col-md-7">
                        <div className="card-body">
                            {!showPlaceholderDetails && details ? (
                                <>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h1 className="card-title">{details.properties.name}</h1>
                                        <button 
                                            className="btn btn-outline-warning" 
                                            onClick={() => toggleFavorite({ uid: id, name: details.properties.name, type: type })}
                                        >
                                            {details.isFavorite ? "★" : "☆"}
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        {type === "people" && (
                                            <>
                                                <p><strong>Height:</strong> {details.properties.height} cm</p>
                                                <p><strong>Mass:</strong> {details.properties.mass} kg</p>
                                                <p><strong>Hair Color:</strong> {details.properties.hair_color}</p>
                                                <p><strong>Skin Color:</strong> {details.properties.skin_color}</p>
                                                <p><strong>Eye Color:</strong> {details.properties.eye_color}</p>
                                                <p><strong>Birth Year:</strong> {details.properties.birth_year}</p>
                                                <p><strong>Gender:</strong> {details.properties.gender}</p>
                                            </>
                                        )}
                                        {type === "vehicles" && (
                                            <>
                                                <p><strong>Model:</strong> {details.properties.model}</p>
                                                <p><strong>Manufacturer:</strong> {details.properties.manufacturer}</p>
                                                <p><strong>Cost:</strong> {details.properties.cost_in_credits} credits</p>
                                                <p><strong>Length:</strong> {details.properties.length} m</p>
                                                <p><strong>Crew:</strong> {details.properties.crew}</p>
                                                <p><strong>Passengers:</strong> {details.properties.passengers}</p>
                                                <p><strong>Cargo Capacity:</strong> {details.properties.cargo_capacity} kg</p>
                                            </>
                                        )}
                                        {type === "planets" && (
                                            <>
                                                <p><strong>Diameter:</strong> {details.properties.diameter} km</p>
                                                <p><strong>Rotation Period:</strong> {details.properties.rotation_period} hours</p>
                                                <p><strong>Orbital Period:</strong> {details.properties.orbital_period} days</p>
                                                <p><strong>Gravity:</strong> {details.properties.gravity}</p>
                                                <p><strong>Population:</strong> {details.properties.population}</p>
                                                <p><strong>Climate:</strong> {details.properties.climate}</p>
                                                <p><strong>Terrain:</strong> {details.properties.terrain}</p>
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <h2>Details could not be loaded</h2>
                                    <p>The API may be temporarily unavailable due to rate limiting.</p>
                                </div>
                            )}
                            <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;