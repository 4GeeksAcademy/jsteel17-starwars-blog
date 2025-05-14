import React, { useContext, useEffect, useState } from "react";
import { StarWarsContext } from "../store/StarWarsContext";
import { Link } from "react-router-dom";

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

const Card = ({ item, type }) => {
    const { toggleFavorite, favorites } = useContext(StarWarsContext);
    const [details, setDetails] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`https://www.swapi.tech/api/${type}/${item.uid}`);
                
                // If API request fails, still continue without error
                if (!response.ok) {
                    console.log(`API request failed for ${type}/${item.uid}, but continuing with image only`);
                    return;
                }
                
                const data = await response.json();
                setDetails(data.result.properties);
            } catch (error) {
                console.error(`Error fetching details for ${type}:`, error);
                // Silently fail - we'll just show the card with the image
            }
        };
        
        fetchDetails();
    }, [item.uid, type]);

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
        if (typeImages[item.uid]) {
            return typeImages[item.uid];
        }
        
        // Use type default
        return typeImages.default || 'https://lumiere-a.akamaihd.net/v1/images/star-wars-character_25fitdr3.jpeg';
    };

    return (
        <div className="card me-3 mb-3" style={{ minWidth: '18rem', maxWidth: '22rem', flex: '0 0 auto' }}>
            <img 
                src={getImageUrl()} 
                className="card-img-top" 
                alt={item.name} 
                style={{ height: '200px', objectFit: 'cover' }}
                onError={handleImageError}
            />
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                {details ? (
                    <>
                        {type === "people" && (
                            <>
                                <p className="mb-1">Gender: {details.gender}</p>
                                <p className="mb-1">Hair Color: {details.hair_color}</p>
                                <p className="mb-1">Eye Color: {details.eye_color}</p>
                            </>
                        )}
                        {type === "vehicles" && <p className="mb-1">Model: {details.model}</p>}
                        {type === "planets" && <p className="mb-1">Climate: {details.climate}</p>}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                <div className="mt-3">
                    <Link to={`/${type}/${item.uid}`} className="btn btn-primary">Learn more!</Link>
                    <button className="btn btn-outline-warning ms-2" onClick={() => toggleFavorite({...item, type})}>
                        {favorites.some((fav) => fav.uid === item.uid) ? "★" : "☆"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;