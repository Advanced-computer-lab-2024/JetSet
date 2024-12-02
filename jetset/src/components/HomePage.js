import React from "react";
import Guest from "./Guest";

const Home = () => {
  return (
    <div style={styles.container}>
      <h2>Welcome to Jetset</h2>
      <p>Your adventure starts here!</p>
      <Guest /> {}
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
};

export default Home;
