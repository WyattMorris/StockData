import React, { useContext } from "react";
import NavBar from "../components/NavBar";
import Form from "../components/Form";
import DenseTable from "../UI/DenseTable";
import AuthContext from "../context/auth-context";

const Portfolio = () => {
  const userContext = useContext(AuthContext);
  return (
    <React.Fragment>
      <NavBar />
      <Form />
      <DenseTable display={false} listdata={userContext.tickerList} />
    </React.Fragment>
  );
};
export default Portfolio;
