import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/styles";

import { login } from "../../redux/actions/auth";
import ActiveScreenModal from "../../components/modals/ActiveScreenModal";
import backgroundImage from "../../assests/image_1.jpg";
import { Axios } from "../../utils/axios";
import ChangePasswordModal from "../../components/modals/ChangePasswordModal";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "100%",
    height: "100vh",
  },
  background: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ActiveScreen = (props) => {
  const classes = useStyles();

  const { history, login } = props;

  const [error, setError] = useState(false);

  const [required, setRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChangePassword = (userInfo) => {
    history.replace("/verification");
    return;
    setError(false);
    setRequired(false);

    const { userId, password } = userInfo;

    if (userId !== "" && password !== "") {
      Axios.post("/auth/login", userInfo)
        .then((res) => {
          if (res.data.status) {
            window.localStorage.setItem(
              "authUser",
              JSON.stringify(res.data.data)
            );
            Axios.defaults.headers.common = {
              Authorization: `Bearer ${res.data.data.token}`,
            };
            login(res.data.data);
            history.replace("/dashboard");
          } else if (res.data.status === false) {
            setError(true);
            setErrorMessage(res.data.message);
          }
        })
        .catch((err) => {
          setError(true);
        });
    } else {
      setRequired(true);
    }
  };

  return (
    <Fragment>
      <div className={classes.wrapper}>
        <img
          src={backgroundImage}
          className={classes.background}
          alt="background"
        />
        <ChangePasswordModal
          handleChangePassword={handleChangePassword}
          handleSkip={handleChangePassword}
          error={error}
          errorMessage={errorMessage}
          requiredField={required}
        />
      </div>
    </Fragment>
  );
};

ActiveScreen.propTypes = {
  history: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      login,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ActiveScreen);
