import React, { useEffect, useState } from 'react';
import './style.css';
import { useParams } from 'react-router-dom';

function petCards() {

    const [petList, setPetList] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const requestOptions = {
                    method: 'GET'
                };

                const response = await fetch(`http://localhost:8000/shelter/${id}/`, requestOptions);
                const result = await response.json();
                console.log(result);
                setShelter(result);


            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();

    }, [id]);

}


export default petCards;