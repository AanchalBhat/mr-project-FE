import React from 'react';

import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTable from '../../components/table';

const useStyles = makeStyles((theme) => ({
  mb2: {
    marginBottom: theme.spacing(2),
  },
  button: {
    fontSize: 14,
    fontWeight: 500,
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));

const createData = (id, createdAt, reporter) => ({
  id, createdAt, reporter,
});

const Reports = () => {
  const classes = useStyles();

  const columns = [
    { title: 'Report ID', field: 'id' },
    { title: 'Reported At', field: 'createdAt' },
    { title: 'Reported By', field: 'reporter' },
    {
      title: '',
      field: 'action',
      cellStyle: {
        padding: '8px',
        minWidth: '400px',
      },
      render: () => (
        <>
          <Button className={classes.button} variant="contained" color="primary">
            Print
          </Button>
          <Button className={classes.button} variant="contained" color="primary">
            Export .xlsx
          </Button>
          <Button className={classes.button} variant="contained" color="primary">
            Export .PDF
          </Button>
        </>
      ),
    },
  ];

  const data = [
    createData('S435634234234', '4/16/2020', 'Reporter A'),
    createData('G435634573434', '4/16/2020', 'Reporter B'),
    createData('D435634975683', '4/16/2020', 'Reporter C'),
    createData('A435634589438', '4/16/2020', 'Reporter D'),
    createData('T435634383983', '4/16/2020', 'Reporter E'),
    createData('M435634584732', '4/16/2020', 'Reporter F'),
  ];

  return (
    <CustomTable title="Reports" columns={columns} data={data} />
  );
};

export default Reports;
