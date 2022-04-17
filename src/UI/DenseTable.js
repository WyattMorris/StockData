import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NumberFormat from "react-number-format";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import AuthContext from "../context/auth-context";

const DenseTable = (props) => {
  const userContext = useContext(AuthContext);
  const myFontSize = "17px";
  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "60vw",
        margin: "0 auto",
        marginTop: "1vh",
        opacity: "1",
      }}
    >
      <Table sx={{ width: "60vw" }} size="small" aria-label="a dense table">
        <TableHead sx={{ backgroundColor: "#D8D8D8" }}>
          <TableRow>
            <TableCell sx={{ fontSize: myFontSize }}>
              Company&nbsp;Name
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Ticker
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Price
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Day&nbsp;Change
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Shares
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Value
            </TableCell>
            <TableCell sx={{ fontSize: myFontSize }} align="right">
              Annual&nbsp;Dividend
            </TableCell>
            {!props.display && (
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                Remove
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.listdata.map((ticker) => (
            <TableRow key={ticker.ticker}>
              <TableCell sx={{ fontSize: myFontSize }}>
                {ticker.fullName}
              </TableCell>
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                {ticker.ticker}
              </TableCell>
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                <NumberFormat
                  value={ticker.price.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </TableCell>
              <TableCell
                align="right"
                sx={
                  ticker.change > 0
                    ? { color: "green", fontSize: myFontSize }
                    : { color: "salmon", fontSize: myFontSize }
                }
              >
                <NumberFormat
                  value={ticker.change.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={""}
                />
                %
              </TableCell>
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                {ticker.amount}
              </TableCell>
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                <NumberFormat
                  value={(ticker.price * ticker.amount).toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              </TableCell>
              <TableCell sx={{ fontSize: myFontSize }} align="right">
                <NumberFormat
                  value={ticker.dividend.toFixed(2)}
                  displayType={"text"}
                  thousandSeparator={true}
                />
                %
              </TableCell>
              {!props.display && (
                <TableCell align="right" sx={{ cursor: "pointer" }}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    id={ticker.id}
                    size={"2x"}
                    onClick={userContext.removeTicker}
                    color={"crimson"}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default DenseTable;
