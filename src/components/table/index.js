import React from "react";
import PropTypes from "prop-types";
import MaterialTable from "material-table";
import tableIcons from "./tableIcons";

const CustomTable = (props) => {
  const {
    title,
    columns,
    data,
    OnRowAdd,
    OnRowUpdate,
    onRowDelete,
    onChangePage,
    pageSize,
    onChangeRowsPerPage,
    onSearchChange,
    tableRef,
  } = props;

  const onChangeRowsPerPageHandler = (event) => {
    onChangeRowsPerPage(event);
    setTimeout(() => {
      window.document
        .querySelector(".MuiPaper-root.MuiAppBar-root")
        .scrollIntoView();
    }, 0);
  };

  let availablePages = [5, 10, 20, 30];

  if (availablePages.indexOf(pageSize) === -1) {
    availablePages.push(pageSize);
  }

  return (
    <MaterialTable
      style={{ margin: "10px 0px" }}
      icons={tableIcons}
      title={title}
      columns={columns}
      data={data}
      tableRef={tableRef}
      options={{
        thirdSortClick: false,
        pageSize: pageSize,
        pageSizeOptions: availablePages.sort((a, b) => a - b),
        paginationType: "stepped",
        headerStyle: {
          color: "#fff",
          fontWeight: 700,
          backgroundColor: "rgba(0, 0, 0, 0.75)",
        },
      }}
      editable={{
        // isEditable: true,
        onRowAdd: OnRowAdd,
        onRowUpdate: OnRowUpdate,
        onRowDelete: onRowDelete,
      }}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPageHandler}
      onSearchChange={onSearchChange}
    />
  );
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  pageSize: PropTypes.number,
  deleteRow: PropTypes.func,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  onSearchChange: PropTypes.func,
};

CustomTable.defaultProps = {
  title: "",
  columns: [],
  data: [],
  tableRef: () => {},
  pageSize: 5,
  onChangePage: () => {},
  onChangeRowsPerPage: () => {},
  deleteRow: () => {},
  onSearchChange: () => {},
};

export default CustomTable;
