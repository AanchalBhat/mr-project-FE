import React, { useState, useEffect, useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import _ from 'lodash';
import { logOut } from "../../redux/actions/auth";
import { add_evaluation_bulk } from "../../redux/actions/sce";
import { add_bulk_document } from "../../redux/actions/user-document";
import TopBar from "../../components/topbar";
import CustomTabs from "../../components/tabs";

import { Axios } from "./../../utils/axios";

import { CircularProgress, Backdrop } from "@material-ui/core";

import { tabPanelOptions } from "./tabs";

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 80,
    fontWeight: 600,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    color: "white",
    position: "absolute",
    top: theme.spacing(8),
  },
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

const Dashboard = (props) => {
  const classes = useStyles();

  const { user, logOut, add_evaluation_bulk } = props;

  const [loading, setLoading] = useState(false);

  const handleLogOut = useCallback(() => {
    logOut();
  }, [logOut]);

  const currentRole = useMemo(() => user.role.includes('[') ? JSON.parse(user.role) : user.role, [user.role])
  const roleArray = useMemo(() => user.role.includes('['), [user.role])

  const tabs = tabPanelOptions
    .map((option) => {
      let checkRole = false
      if (roleArray) {
        console.log(_.intersection(option.roles, currentRole).length > 0)
        checkRole = _.intersection(option.roles, currentRole).length > 0
      } else {
        checkRole = option.roles.indexOf(currentRole) > -1
      }
      if (checkRole) {
        return option.tab;
      }
      return null;
    })
    .filter((tab) => tab);
  const tabContents = tabPanelOptions
    .map((option) => {
      let checkRole = false
      if (roleArray) {
        console.log(_.intersection(option.roles, currentRole).length > 0)
        checkRole = _.intersection(option.roles, currentRole).length > 0
      } else {
        checkRole = option.roles.indexOf(currentRole) > -1
      }
      if (checkRole) {
        return option.tabContent;
      }
      return null;
    })
    .filter((tabContent) => tabContent);

  const getSubContractorList = () => {
    return new Promise((resolve, reject) => {
      let url = "";
      if (user.role === "Prime Contractor") {
        url = `/sub-contractor?userId=${user.userId}`;
      } else {
        url = `/sub-contractor?contract_agency=${user.agency_code}&status=Completed`;
      }
      Axios.get(url)
        .then((response) => {
          add_evaluation_bulk(response.data);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          alert("error");
          reject();
        });
    });
  };

  const callData = async () => {
    switch (user.role) {
      case "System Admin":
        try {
          await getSubContractorList();
          // await getUserDocuments();
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;

      case "Prime Contractor":
        try {
          await getSubContractorList();
          // await getUserDocuments()
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;

      case "Small Business Specialist":
        try {
          await getSubContractorList();
          // await getUserDocuments()
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;

      case "Contract Specialist":
        try {
          await getSubContractorList();
          // await getUserDocuments();
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;

      case "Technical Specialist":
        try {
          await getSubContractorList();
          // await getUserDocuments();
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;

      case "Sub Contractor":
        try {
          await getSubContractorList();
          // await getUserDocuments()
          setLoading(false);
        } catch (exp) {
          setLoading(false);
          console.log(exp);
        }
        break;
      default:
        setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    callData();
  }, [user]);

  return (
    <div className={classes.wrapper}>
      <TopBar user={user} handleLogout={handleLogOut} />
      <CustomTabs tabs={tabs} tabContents={tabContents} />
    </div>
  );
};

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
  logOut: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  user: store.authData.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      logOut,
      add_evaluation_bulk,
      add_bulk_document,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
