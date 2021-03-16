import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu
} from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer'
  },
  avatarWrap: {
    display: 'flex',
    flexDirection: 'column'
  },
  avatar: {
    alignSelf: 'flex-end'
  },
  label: {
    color: 'white',
    fontSize: 16
  }
}));

const TopBar = (props) => {
  const classes = useStyles();

  const { handleLogout, user } = props;

  // eslint-disable-next-line no-unused-vars
  const [auth, setAuth] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickLogout = () => {
    window.localStorage.clear()
    handleLogout();
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
             <Link to="/dashboard" style={{textDecoration: 'none', color: '#ffffff'}}>
                Market Research Tool
              </Link>
          </Typography>
          {auth && (
            <div className={classes.avatarWrap}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                className={classes.avatar}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Typography variant="h6" className={classes.label}>
                {user.userId}
              </Typography>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>      
                <Link to="/dashboard/profile" style={{textDecoration: 'none', color: 'rgba(0, 0, 0, 0.87)'}}>
                  My Profile
                </Link></MenuItem>
                <MenuItem onClick={handleClickLogout}>Log out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

TopBar.propTypes = {
  handleLogout: PropTypes.func,
  user: PropTypes.object,
};

TopBar.defaultProps = {
  handleLogout: () => {},
  user: {}
};

export default TopBar;
