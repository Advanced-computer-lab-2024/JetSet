import React from 'react';
import TagForm from "./components/TagForm";   // Correct relative path
import PlaceForm from "./components/PlaceForm";  // Correct relative path
import PlaceList from "./components/PlaceList";
// App.js




const App = () => {
  return (
    <div>
      <h1>Tourism App</h1>
      <PlaceForm />
      <PlaceList />
      <TagForm />
    </div>
  );
};


export default App;
