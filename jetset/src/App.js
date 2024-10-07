import React, { useState } from 'react';
//GUEST
import RegisterForm from './components/RegisterForm';
import ActivityFilterForm from './components/ActivityFilterForm';
import ItineraryFilterForm from './components/ItineraryFilterForm';
import HistoricalFilterForm from './components/HistoricalFilterForm';

import axios from 'axios';
import TouristRegister from './components/TouristRegister';

const App = () => {
    //const [selectedProfile, setSelectedProfile] = useState(null);
    //const [selectedActivity, setSelectedActivity] = useState(null);



    const handleSubmit = async (data) => {
        try {
            if (selectedActivity) {
                await axios.put(`/updateactivity/${selectedActivity._id}`, data);
            } else {
                await axios.post('/addactivity', data);
            }
            setSelectedActivity(null);
            // Optionally refresh the activity list
        } catch (error) {
            console.error('Error submitting activity:', error);
        }
    };

    return (
        <div>
          <h1>Guest Controller Page</h1>
          <RegisterForm />
          <TouristRegister />
          <ActivityFilterForm />
          <ItineraryFilterForm />
          <HistoricalFilterForm />
        </div>
      );
};


export default App;
