'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, Pagination } from '@icedesign/base';

import IceCard from '@icedesign/card';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';

import FilterForm from './Filter';

@DataBinder({
  tableData: {
    // 详细请求配置请参见 https://github.com/axios/axios
    url: '/mock/filter-table-list.json',
    params: {
      page: 1
    },
    defaultBindingData: {
      list: [],
      total: 100,
      pageSize: 10,
      currentPage: 1
    }
  }
})
export default class EnhanceTable extends Component {
  static displayName = 'EnhanceTable';

  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    // 请求参数缓存
    this.queryCache = {};
    this.state = {
      filterFormValue: {}
    };
  }

  // ICE: React Component 的生命周期

  componentWillMount() { }

  componentDidMount() {
    this.queryCache.page = 1;
    this.fetchData();
  }

  componentWillReceiveProps(nextProps, nextContext) { }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() { }

  fetchData = () => {
    this.props.updateBindingData('tableData', {
      data: this.queryCache
    });
  };

  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <div>
          <IceImg src={record.cover} width={48} height={48} />
        </div>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  editItem = (record, e) => {
    e.preventDefault();
    // todo
  };

  renderOperations = (value, index, record) => {
    return (
      <div
        className="filter-table-operation"
        style={styles.filterTableOperation}
      >
        <a
          href="#"
          style={styles.operationItem}
          target="_blank"
          onClick={this.editItem.bind(this, record)}
        >
          解决
        </a>
        <a href="#" style={styles.operationItem} target="_blank">
          详情
        </a>
        <a href="#" style={styles.operationItem} target="_blank">
          分类
        </a>
      </div>
    );
  };

  renderStatus = (value, index, record) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  changePage = currentPage => {
    this.queryCache.page = currentPage;

    this.fetchData();
  };

  filterFormChange = value => {
    this.setState({
      filterFormValue: value
    });
  };

  filterTable = () => {
    // 合并参数，请求数据
    this.queryCache = {
      ...this.queryCache,
      ...this.state.filterFormValue
    };
    this.fetchData();
  };

  resetFilter = () => {
    this.setState({
      filterFormValue: {}
    });
  };

  render() {
    const tableData = this.props.bindingData.tableData;
    const { filterFormValue } = this.state;

    return (
      <div className="filter-table">
        <IceCard style={styles.cardWrapper}>
          <FilterForm
            value={filterFormValue}
            onChange={this.filterFormChange}
            onSubmit={this.filterTable}
            onReset={this.resetFilter}
          />
        </IceCard>
        <IceCard>
          <Table
            dataSource={tableData.list}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
          >
            <Table.Column title="问题描述" cell={this.renderTitle} width={320} />
            <Table.Column title="问题分类" dataIndex="type" width={85} />
            <Table.Column title="发布时间" dataIndex="publishTime" width={150} />
            <Table.Column
              title="状态"
              dataIndex="publishStatus"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.todo4}>
            <Pagination
              current={tableData.currentPage}
              pageSize={tableData.pageSize}
              total={tableData.total}
              onChange={this.changePage}
            />
          </div>
        </IceCard>
      </div>
    );
  }
}

const styles = {
  filterTableOperation: { lineHeight: '28px' },
  operationItem: {
    marginRight: '12px',
    textDecoration: 'none'
  },
  titleWrapper: { display: 'flex', flexDirection: 'row' },
  title: { marginLeft: '10px', lineHeight: '20px' },
  cardWrapper: {
    minHeight: 0,
    marginBottom: 20,
    display: 'flex',
    justifyContent: 'space-between'
  },
  todo4: { textAlign: 'right', paddingTop: '26px' }
};
