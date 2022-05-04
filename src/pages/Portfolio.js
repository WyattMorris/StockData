import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import Form from "../components/Form";
import DenseTable from "../UI/DenseTable";
import AuthContext from "../context/auth-context";
import Footer from "../components/Footer";

const Portfolio = () => {
  const userContext = useContext(AuthContext);
  return (
    <React.Fragment>
      <NavBar />
      <div style={{ minHeight: "76vh", height: "auto" }}>
        <Form />
        <DenseTable display={false} listdata={userContext.tickerList} />
      </div>

      <Footer />
    </React.Fragment>
  );
};
export default Portfolio;
