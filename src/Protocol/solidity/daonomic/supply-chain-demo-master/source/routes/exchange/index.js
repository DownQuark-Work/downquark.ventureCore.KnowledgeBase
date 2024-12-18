import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Table, Button } from 'antd';
import { Address } from '../../components/address';
import { DateFormat } from '../../components/date-format';
import { NumberFormat } from '../../components/number-format';

const { Column } = Table;

function BidAskTable({ dataSource }) {
  return (
    <Table dataSource={dataSource} pagination={false}>
      <Column
        title="qty (ton)"
        dataIndex="qty"
        key="qty"
        render={(value) => <NumberFormat value={value} />}
      />
      <Column
        title="exp"
        dataIndex="exp"
        key="exp"
        render={(value) => <DateFormat value={value} />}
      />
      <Column
        title="Price"
        dataIndex="price"
        key="price"
        render={(value) => (
          <React.Fragment>
            ¥ <NumberFormat value={value} />
          </React.Fragment>
        )}
      />
    </Table>
  );
}

BidAskTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
};

export function Exchange() {
  return (
    <Layout>
      <Layout.Header>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fff',
          }}
        >
          <h1 style={{ color: '#fff', margin: 0 }}>BANKEX</h1>
          <div style={{ padding: '0 1em' }}>Contract: ¥ 2,457,300</div>
          <div style={{ padding: '0 1em' }}>Wallet balance: ¥ 43,825,750</div>
          <div style={{ padding: '0 1em' }}>
            Max asset Valuation: ¥ 820,000,000
          </div>
        </div>
      </Layout.Header>

      <Layout.Content style={{ padding: '0 50px' }}>
        <div
          style={{
            background: '#fff',
            padding: 24,
            marginTop: 24,
            minHeight: 280,
          }}
        >
          <section>
            <h2>Avocado exchange</h2>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <section style={{ margin: '0 1em' }}>
                <header
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h2>Bid</h2>
                  <Button>Place bid</Button>
                </header>

                <BidAskTable
                  dataSource={[
                    {
                      key: '1',
                      qty: 75,
                      exp: new Date(),
                      price: 72800,
                    },
                    {
                      key: '2',
                      qty: 30,
                      exp: new Date(),
                      price: 73550,
                    },
                    {
                      key: '3',
                      qty: 108,
                      exp: new Date(),
                      price: 73900,
                    },
                  ]}
                />
              </section>

              <section style={{ margin: '0 1em' }}>
                <header
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <h2>Ask</h2>
                  <Button>Place ask</Button>
                </header>
                <BidAskTable
                  dataSource={[
                    {
                      key: '1',
                      qty: 16,
                      exp: new Date(),
                      price: 71330,
                    },
                    {
                      key: '2',
                      qty: 45,
                      exp: new Date(),
                      price: 70543,
                    },
                    {
                      key: '3',
                      qty: 24,
                      exp: new Date(),
                      price: 70120,
                    },
                    {
                      key: '4',
                      qty: 62,
                      exp: new Date(),
                      price: 70060,
                    },
                  ]}
                />
              </section>
            </div>

            <section style={{ margin: '1em 0' }}>
              <h2>Deals</h2>
              <Table
                dataSource={[
                  {
                    key: '1',
                    address: '0x2g8CF7881C8E64fCD26aB6426C88e5C2d660A8dc',
                    commodity: 'Avocado',
                    quantity: 30,
                    price: 72500,
                    expDate: new Date(),
                    status: 'delivery',
                  },
                  {
                    key: '2',
                    address: '0xa63CF7881C8E64fCD26aB6426C88e5C2d660Ah77',
                    commodity: 'Avocado',
                    quantity: 45,
                    price: 71350,
                    expDate: new Date(),
                    status: 'received',
                  },
                  {
                    key: '3',
                    address: '0xb12CF7881C8E64fCD26aB6426C88e5C2d660A1a0',
                    commodity: 'Avocado',
                    quantity: 73,
                    price: 72430,
                    expDate: new Date(),
                    status: 'paid',
                  },
                ]}
              >
                <Column
                  title="Contract"
                  dataIndex="address"
                  key="address"
                  render={(value) => <Address address={value} />}
                />
                <Column
                  title="Commodity"
                  dataIndex="commodity"
                  key="commodity"
                />
                <Column
                  title="Quantity (tons)"
                  dataIndex="quantity"
                  key="quantity"
                  render={(value) => <NumberFormat value={value} />}
                />
                <Column
                  title="Price"
                  dataIndex="price"
                  key="price"
                  render={(value) => (
                    <React.Fragment>
                      ¥ <NumberFormat value={value} />
                    </React.Fragment>
                  )}
                />
                <Column
                  title="Exp. date"
                  dataIndex="expDate"
                  key="expDate"
                  render={(value) => <DateFormat value={value} />}
                />
                <Column title="Status" dataIndex="status" key="status" />
              </Table>
            </section>
          </section>
        </div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: 'center' }}>© 2019</Layout.Footer>
    </Layout>
  );
}
