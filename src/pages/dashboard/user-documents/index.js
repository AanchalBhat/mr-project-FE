// React Imports
import React, { Fragment, useState, useEffect } from 'react';

// Redux Imports

import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';

// Material Imports

import { Button, ButtonGroup, CircularProgress } from '@material-ui/core';

// Custom Imports

import CustomTable from '../../../components/table';

import UserDocumentsModal from './../../../components/modals/UserDocumentModal';

import {
  add_document,
  replace_document,
} from './../../../redux/actions/user-document';

import { Axios } from './../../../utils/axios';

import { base64Download } from './../../../utils/download-base64';
import { uuid } from 'uuidv4';

const UserDocuments = ({
  user,
  userDocument,
  add_document,
  replace_document,
}) => {
  // Local Variables

  const EMPTY_FORM_DATA = {
    provider: user.userId,
    authority:
      'Market research is required in accordance with FAR 7.102, 7.104(a), and FAR 10.001.',
    acquisition: null,
    officeSymbol: user.office_symbol,
    title: '',
    NAICSCode: '',
    organization: user.agency_code,
    requirements: '',
    price_value: '',
    involvement: null,
    involvementTableData: [],
    techSource: null,
    sources: [],
    companyScale: null,
    companyType: 'Yes',
    sourceSummary: '',
    addSource: '',
    characteristic: '',
    extentMarket: '',
    businessPractices: '',
    compileData: '',
    issues: '',
    issues_amt: '',
    consideration: '',
    compileDataTable: [],
    priceMatrix: [],
    isSubmitted: false,
  };

  const columns = [
    {
      title: 'ID',
      field: 'documentId',
      cellStyle: {
        cursor: 'pointer',
      },
      render: (rowData) => (
        <span onClick={() => openThisDocument(rowData)}>
          {rowData.documentId || '<ID Not Provided>'}
        </span>
      ),
    },
    {
      title: 'Document Title',
      field: 'title',
    },
    {
      title: 'User',
      field: 'provider',
      render: (props) => <span>{props.provider}</span>,
    },
    {
      title: 'Office Symbol',
      field: 'officeSymbol',
    },
    {
      title: 'NAICS Code',
      field: 'NAICSCode',
    },
    {
      title: 'Document Stataus',
      field: 'isSubmitted',
      render: ({ isSubmitted }) =>
        isSubmitted ? <span>Complete</span> : <span>Draft</span>,
    },
    {
      title: 'Created At',
      field: 'createdAt',
      searchable: false,
      render: ({ createdAt }) => (
        <span>{new Date(createdAt).toLocaleString()}</span>
      ),
    },
  ];

  // Local State

  const [formData, setFormData] = useState({ ...EMPTY_FORM_DATA });

  const [openDocModal, setOpenDocModal] = useState(false);

  const [agencyList, setAgencyList] = useState([]);

  const [debounce, setDebounce] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [pageSize, setPageSize] = useState(5);

  const [loading, setLoading] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);

  const [tableRef, setTableRef] = useState(null);

  const [onlyUser, setOnlyUser] = useState('');

  // useEffect Methods

  useEffect(() => {
    getAgencies();
  }, []);

  // Local Methods

  const handleExportToPdf = async () => {
    setPdfLoading(true);
    Axios.get(`document/pdf-view/${formData._id}`)
      .then((response) => {
        if (response.data.status) {
          base64Download(
            `${formData.documentId}.pdf`,
            response.data.data,
            'application/pdf',
          );
          setPdfLoading(false);
        } else {
          alert('Something went wrong! Please try again');
          console.log(response.data);
          setPdfLoading(false);
        }
      })
      .catch((err) => {
        alert('Something went wrong! Please try again');
        console.log(err);
        setPdfLoading(false);
      });
  };

  const getAgencies = async () => {
    Axios.get('/agency/all')
      .then((res) => {
        setAgencyList(
          res.data.data.map((a) => ({
            label: a.Agency_Name,
            value: a.AgencyID,
          })),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openNewDocument = () => {
    setFormData({ ...EMPTY_FORM_DATA });
    setOpenDocModal(true);
  };

  const openThisDocument = (document) => {
    setOpenDocModal(true);
    setLoading(true);
    Axios.get(`document/${document._id}`)
      .then((res) => {
        if (res.data.status) {
          res.data.document[0].priceMatrix = res.data.document[0].priceMatrix.map(
            (pm) => ({ ...pm, index: uuid() }),
          );
          setFormData({ ...EMPTY_FORM_DATA, ...res.data.document[0] });
        } else {
          setOpenDocModal(false);
          alert('Something went wrong! Please try again.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setOpenDocModal(false);
        alert('Something went wrong! Please try again.');
      });
  };

  const handleSave = () => {
    const uri = formData.documentId
      ? '/document/updateDocument'
      : '/document/createDocument';
    Axios.post(uri, formData)
      .then((res) => {
        if (res.data.status) {
          alert(
            res.data.document.isSubmitted
              ? 'Your document has been submitted successfully'
              : 'Your document has been saved successfully',
          );
          setOpenDocModal(false);
          formData.documentId
            ? replace_document(res.data.document)
            : add_document(res.data.document);
          tableRef && tableRef.onQueryChange();
        } else {
          alert('Something went wrong! Please try again');
          setOpenDocModal(false);
          console.log(res);
        }
      })
      .catch((err) => {
        alert('Something went wrong! Please try again');
        setOpenDocModal(false);
        console.log(err);
      });
  };

  // Paginated Table Methods

  const onChangeRowsPerPage = (e) => {
    setPageSize(e);
  };

  const getTableData = (query) =>
    new Promise((resolve, reject) => {
      let url = 'document/';
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
                onlyUser,
              },
            }).then((result) => {
              resolve({
                data: result.data.documents,
                page: result.data.page,
                totalCount: result.data.total,
              });
            });
          },
          searchTerm === query.search ? 0 : 1000,
        ),
      );
      setSearchTerm(query.search);
    });

  return (
    <Fragment>
      <Button variant="contained" color="primary" onClick={openNewDocument}>
        + Create Document
      </Button>

      <CustomTable
        title={
          <ButtonGroup
            style={{ position: 'absolute', left: 0, top: 15 }}
            variant="text"
            color="primary"
            aria-label="text primary button group"
          >
            <Button
              variant={onlyUser === '' ? 'contained' : 'outlined'}
              onClick={(e) => {
                setOnlyUser('');
                tableRef && tableRef.onQueryChange();
              }}
            >
              Agency Documents
            </Button>
            <Button
              variant={onlyUser !== '' ? 'contained' : 'outlined'}
              onClick={(e) => {
                setOnlyUser('yes');
                tableRef && tableRef.onQueryChange();
              }}
            >
              My Documents
            </Button>
          </ButtonGroup>
        }
        columns={columns}
        data={getTableData}
        pageSize={pageSize}
        tableRef={(ref) => setTableRef(ref)}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />

      <UserDocumentsModal
        user={user}
        open={openDocModal}
        formData={formData}
        setFormData={setFormData}
        modalAction={setOpenDocModal}
        agencyList={agencyList}
        save={handleSave}
        loading={loading}
        handleExportToPdf={handleExportToPdf}
        pdfLoading={pdfLoading}
      />
    </Fragment>
  );
};

const mapStateToProps = (store) => ({
  user: store.authData.user,
  userDocument: store.userDocument,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ add_document, replace_document }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserDocuments);
