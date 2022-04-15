import React from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/App.module.css";
import NavBar from "../components/NavBar";
import Button from "@mui/material/Button";
import DenseTable from "../UI/DenseTable";
import Graph from "../components/Graph";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Loading from "../UI/Loading";

const Homepage = (props) => {
  return (
    <>
      <React.Fragment>
        <NavBar buttons={true} home={true} />
        <div className={styles.main}>
          <div className={styles.header}>
            <h1 className={styles.h1}>
              Lets Build
              <br /> Your Portfolio
            </h1>
            <NavLink to="/portfolio">
              <Button
                type="submit"
                variant="outlined"
                className={styles.button}
              >
                Create Portfolio
              </Button>
            </NavLink>
            <div className={styles.table}>
              <DenseTable
                listdata={props.listdata.sort((a, b) => b.price - a.price)}
                display={true}
              />
              {props.isLoading && <Loading />}
              {props.isError && (
                <p>Unable to connect to Stock API. Please try again soon.</p>
              )}
            </div>
          </div>
          <div className={styles.arrow}>
            <FontAwesomeIcon
              icon={faAngleDown}
              size={"2x"}
              sx={{ color: "crimson" }}
            />
          </div>
          <div className={styles.graphContainer}>
            <div className={styles.graph}>
              <Graph title="First Graph" />
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    </>
  );
};

export default Homepage;
