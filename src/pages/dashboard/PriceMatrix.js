import React, { useState } from "react";

// Redux Imports

import { connect } from "react-redux";

// Material Imports

import { Input, FormControl } from "@material-ui/core";

// Custom Imports

import { Axios } from "./../../utils/axios";

import CustomTable from "../../components/table";

import NumberFormatCustom from "./../../components/inputs/NumberMask";

const PriceMatrix = ({ user }) => {
  const columns = [
    { title: "Document ID", field: "documentId" },
    { title: "Description", field: "description" },
    {
      title: "Government Costs",
      field: "governmentCosts",
      render: (props) => {
        return (
          <FormControl>
            <Input
              {...props}
              disabled={true}
              style={{ color: "black" }}
              value={parseFloat(props.governmentCosts).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: "Historical Price",
      field: "historicalPrice",
      render: (props) => {
        return (
          <FormControl>
            <Input
              {...props}
              disabled={true}
              style={{ color: "black" }}
              value={parseFloat(props.historicalPrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: "Catalog Price",
      field: "catalogPrice",
      render: (props) => {
        return (
          <FormControl>
            <Input
              {...props}
              disabled={true}
              style={{
                color: "black",
              }}
              value={parseFloat(props.catalogPrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: "Average Price",
      field: "averagePrice",
      render: (props) => {
        return (
          <FormControl>
            <Input
              {...props}
              disabled={true}
              style={{ color: "black" }}
              value={parseFloat(props.averagePrice).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
    {
      title: "Plus 15% of AVG",
      field: "plusAvg",
      render: (props) => {
        return (
          <FormControl>
            <Input
              {...props}
              disabled={true}
              style={{ color: "black" }}
              value={parseFloat(props.plusAvg).toFixed(2)}
              inputComponent={NumberFormatCustom}
            />
          </FormControl>
        );
      },
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const [pageSize, setPageSize] = useState(5);

  const [debounce, setDebounce] = useState(null);

  const onChangeRowsPerPage = (e) => setPageSize(e);

  const getTableData = (query) =>
    new Promise((resolve, reject) => {
      let url = "price-matrix/";
      if (debounce) clearTimeout(debounce);
      setDebounce(
        setTimeout(
          () => {
            Axios.get(url, {
              params: {
                agencyCode: user.agency_code,
                limit: query.pageSize,
                offset: query.pageSize * query.page,
                searchTerm: query.search,
              },
            }).then((result) => {
              resolve({
                data: result.data.matrix,
                page: result.data.page,
                totalCount: result.data.total,
              });
            });
          },
          searchTerm === query.search ? 0 : 500
        )
      );
      setSearchTerm(query.search);
    });

  return (
    <CustomTable
      title="Prices"
      columns={columns}
      data={getTableData}
      pageSize={pageSize}
      onChangeRowsPerPage={onChangeRowsPerPage}
    />
  );
};

const mapStateToProps = (store) => ({
  user: store.authData.user,
});

export default connect(mapStateToProps)(PriceMatrix);
