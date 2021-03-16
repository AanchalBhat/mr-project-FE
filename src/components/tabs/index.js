import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CustomTabPanel from './TabPanel';

const AntTabs = withStyles({
  root: {
    borderBottom: '1px solid #e8e8e8',
  },
  indicator: {
    backgroundColor: '#3f51b5',
  },
})(Tabs);

const AntTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
  },
  selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomTabs = (props) => {
  const classes = useStyles();

  const { tabs, tabContents } = props;
  const tab = window.localStorage.getItem('currentTab')
  let tabIndex = 0
  if (tab) {
    tabIndex = tabs.indexOf(tab) > -1 ? tabs.indexOf(tab) : 0
  }
  const [value, setValue] = React.useState(tabIndex);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    window.localStorage.setItem('currentTab', tabs[newValue])
  };

  return (
    <div className={classes.root}>
      <AntTabs value={value} onChange={handleChange} aria-label="ant example">
        {tabs.map((tab) => (
          <AntTab label={tab} key={tab} />
        ))}
      </AntTabs>
      {tabContents.map((content, index) => (
        <CustomTabPanel value={value} key={index} index={index}>
          {content}
        </CustomTabPanel>
      ))}
    </div>
  );
};

CustomTabs.propTypes = {
  tabs: PropTypes.array,
  tabContents: PropTypes.array,
};

CustomTabs.defaultProps = {
  tabs: [],
  tabContents: [],
};

CustomTabs.defaultProps = {

};

export default CustomTabs;
