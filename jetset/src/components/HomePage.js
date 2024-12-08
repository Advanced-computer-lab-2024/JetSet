import React from "react";
import Guest from "./Guest";

const Home = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Welcome to Jetset</h2>
      <p style={styles.subHeading}>Your adventure starts here!</p>
      <Guest />
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "50px",
  },
  title: {
    fontSize: "4rem", // Adjust this value for a larger title
    fontWeight: "bold", // Optional: Make it bold
    color: "#1d3557", // Optional: Change text color
    marginBottom: "20px", // Optional: Add spacing below the title
  },
  subHeading: {
    fontSize: "2rem", // Adjust this value for larger font size
    fontWeight: "bold", // Optional: Make it bold
    color: "#1d3557", // Optional: Change text color
    marginTop: "10px", // Optional: Add spacing above
  },
};

export default Home;
