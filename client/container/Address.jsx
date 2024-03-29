
import Actions from '../core/Actions';
import Component from '../core/Component';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import CardAddress from '../component/Card/CardAddress';
import CardAddressTXs from '../component/Card/CardAddressTXs';
import HorizontalRule from '../component/HorizontalRule';
import Pagination from '../component/Pagination';
import Select from '../component/Select';

import { PAGINATION_PAGE_SIZE } from '../constants';

class Address extends Component {
  static propTypes = {
    getAddress: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      address: '',
      balance: 0.0,
      received: 0.0,
      error: null,
      loading: true,
      blacklisted:'false',
      pages: 0,
      page: 1,
      size: 10,
      txs: [],
      utxo: []
    };
  };

  componentDidMount() {
    this.getAddress();
  };

  componentDidUpdate() {
    if (!!this.state.address
      && this.state.address !== this.props.match.params.hash) {
      this.getAddress();
    }
  };

  getAddress = () => {
    this.setState({ loading: true }, () => {
      const address = this.props.match.params.hash;
      var blacklistval = 'No';
      this.props
        .getAddress({ address })
        .then(({ balance, received, txs, utxo }) => {
          switch(address){
            case 'DMycmpxf3xEKgSU2JaKRq68ZXjvfZzPvEd':
            case 'DSw7if1HXa9NBXa4uMCKdYfobrZpE2KUVY':
            case 'DE9X5DnbTj6ramXRC4a2rd5e3jdLguES1s':
            case 'DJyygjtpWKEZctcvghgJZhVzoajiReVfG5':
            case 'DAxMuFzvLvmiVptoXJErNGaPbx429Y6R7L':
            case 'DDEPjbLFqZ3XyfEqqj3k33va7mvuQDfB4a':
            case 'DC5AVzGj27UKEqQEnRuGXWxrMqKadsw5BU':
            case 'DT9LxyfGn91gAWhXedSf81B7ATLseSxuVv':
            case 'DJM1uEdrCiSzZRk9hwpaFi1DmYNFh2gpxL':
            case 'DBHP5rx1dyhgyo6Chpt4mqe5ZXYBc7zpHb':
            case 'DRaaCkzhk9zM76rwcgBmgf5UfemS7bCRBC':
            case 'DAYyhPf9iijgjWU9nf52BveccLdgWp5DLw':
            case 'DU3xQ2uX6BmmWzAHsqENoyJA8SLVpQQjk8':
            case 'DNEmMeB8FbQesnk6zRtPcznwPxDXADUXAg':
          blacklistval = 'Yes';
          }
          this.setState({
            address,
            balance,
            blacklistval,
            received,
            txs,
            utxo,
            loading: false,
            pages: Math.ceil(txs.length / this.state.size)
          });
        })
        .catch(error => this.setState({ error, loading: false }));
    });
  };

  handlePage = page => this.setState({ page: parseInt(page, 10) });

  handleSize = size => this.setState({ size: parseInt(size, 10), page: 1 }, () => {
    this.setState({ pages: Math.ceil(this.state.txs.length / this.state.size) });
  });

  render() {
    if (!!this.state.error) {
      return this.renderError(this.state.error);
    } else if (this.state.loading) {
      return this.renderLoading();
    }
    const selectOptions = PAGINATION_PAGE_SIZE;

    const select = (
      <Select
        onChange={ value => this.handleSize(value) }
        selectedValue={ this.state.size }
        options={ selectOptions } />
    );

    // Setup internal pagination.
    let start = (this.state.page - 1) * this.state.size;
    let end = start + this.state.size;

    return (
      <div>
        <HorizontalRule title="Wallet Info" />
        <CardAddress
          address={ this.state.address }
          balance={ this.state.balance }
          received={ this.state.received }
          txs={ this.state.txs }
          utxo={ this.state.utxo }
          blacklisted = { this.state.blacklistval } />
        <HorizontalRule select={ select } title="Wallet Transactions" />
        <CardAddressTXs
          address={ this.state.address }
          txs={ this.state.txs.slice(start, end) }
          utxo={ this.state.utxo } />
        <Pagination
          current={ this.state.page }
          className="float-right"
          onPage={ this.handlePage }
          total={ this.state.pages } />
        <div className="clearfix" />
      </div>
    );
  };
}

const mapDispatch = dispatch => ({
  getAddress: query => Actions.getAddress(query)
});

const mapState = state => ({

});

export default connect(mapState, mapDispatch)(Address);
