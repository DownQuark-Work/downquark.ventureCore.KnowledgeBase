import React from 'react';
import { Layout, Table, Button } from 'antd';
import { NumberFormat } from '../../components/number-format';
import { DateFormat } from '../../components/date-format';
import { Address } from '../../components/address';
import { fundWorkflows } from '../../workflows/fund';
import { useBalance } from './hooks/use-balance';
import { useUndistributedIncome } from './hooks/use-undistributed-income';
import { useTokensDistribution } from './hooks/use-tokens-distribution';

const { Column } = Table;

export function Fund() {
  const {
    undistributedIncomeState,
    loadUndistributedIncome,
  } = useUndistributedIncome();
  const {
    tokensDistribution,
    loadTokensDistribution,
  } = useTokensDistribution();

  const { balanceState, loadBalance } = useBalance();

  if (undistributedIncomeState.dataState === 'idle') {
    loadUndistributedIncome();
  }

  if (tokensDistribution.dataState === 'idle') {
    loadTokensDistribution();
  }

  if (balanceState.dataState === 'idle') {
    loadBalance();
  }

  function handleCollectIncome() {
    fundWorkflows
      .collectIncome()
      .then(() => {
        loadUndistributedIncome();
        loadBalance();
      })
      .catch((error) => {
        console.error(error);
        alert('Something went wrong');
      });
  }

  function handlePayDividends() {
    fundWorkflows
      .payDividends()
      .then(() => {
        loadUndistributedIncome();
        loadBalance();
      })
      .catch((error) => {
        console.error(error);
        alert('Something went wrong');
      });
  }

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
          <div style={{ padding: '0 1em' }}>
            Fund contract: ¥ <NumberFormat value={balanceState.contract} />
          </div>
          <div style={{ padding: '0 1em' }}>Fund wallet: ¥ 190,500.00</div>
          <div style={{ padding: '0 1em' }}>
            Fund assets valuation: ¥ 820,000,000.00
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
          <section style={{ marginBottom: '2em' }}>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1em',
              }}
            >
              <h2 style={{ margin: 0, marginRight: '.5em' }}>
                Tokens distribution
              </h2>

              <div>
                <Button style={{ margin: '0 .5em' }}>Buy</Button>
                <Button style={{ margin: '0 .5em' }}>Sell</Button>
              </div>
            </header>

            <Table
              showHeader={false}
              pagination={false}
              dataSource={[
                {
                  key: '2',
                  name: 'Investor 1',
                  amount: tokensDistribution.data[0] || 0,
                },
                {
                  key: '3',
                  name: 'Investor 2',
                  amount: tokensDistribution.data[1] || 0,
                },
                {
                  key: '4',
                  name: 'Investor 3',
                  amount: tokensDistribution.data[2] || 0,
                },
              ]}
            >
              <Column dataIndex="name" key="name" />
              <Column
                dataIndex="amount"
                key="amount"
                render={(value) => <NumberFormat value={value} />}
              />
            </Table>
          </section>

          <section style={{ marginBottom: '2em' }}>
            <header
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1em',
              }}
            >
              <h2 style={{ margin: 0, marginRight: '.5em' }}>
                Undistributed income
              </h2>

              <div>
                <Button
                  style={{ margin: '0 .5em' }}
                  onClick={handleCollectIncome}
                >
                  Collect income
                </Button>
                <Button
                  style={{ margin: '0 .5em' }}
                  onClick={handlePayDividends}
                >
                  Pay dividends
                </Button>
              </div>
            </header>

            <Table
              pagination={false}
              dataSource={undistributedIncomeState.data}
            >
              <Column title="Unit name" dataIndex="name" key="name" />
              <Column
                title="Units owned"
                dataIndex="owned"
                key="owned"
                render={(value) => <NumberFormat value={value} />}
              />
              <Column
                title="Income"
                dataIndex="income"
                key="income"
                render={(value) => (
                  <React.Fragment>
                    ¥ <NumberFormat value={value} />
                  </React.Fragment>
                )}
              />
            </Table>
          </section>

          <section>
            <h2 style={{ marginTop: '2em' }}>Transactions log</h2>
            <Table
              dataSource={[
                {
                  key: '1',
                  address: '0x5f5CF7881C8E64fCD26aB6426C88e5C2d660A9a5',
                  type: 'Dividends payout',
                  date: new Date(),
                  unit: '',
                  amount: '95%',
                  total: 35000,
                },
                {
                  key: '2',
                  address: '0x5f5CF7881C8E64fCD26aB6426C88e5C2d660A83a',
                  type: 'Asset income',
                  date: new Date(),
                  unit: 'Avocado farm',
                  amount: '30%',
                  total: 65000,
                },
                {
                  key: '3',
                  address: '0x1d3CF7881C8E64fCD26aB6426C88e5C2d660A82',
                  type: 'Units bought',
                  date: new Date(),
                  unit: 'Avocado farm',
                  amount: '62',
                  total: null,
                },
                {
                  key: '3',
                  address: '0xc84CF7881C8E64fCD26aB6426C88e5C2d660427',
                  type: 'Tokens sell',
                  date: new Date(),
                  unit: 'Investor 1',
                  amount: '100',
                  total: null,
                },
              ]}
            >
              <Column
                title="Transaction"
                dataIndex="address"
                key="address"
                render={(address) => <Address address={address} />}
              />
              <Column title="Operation type" dataIndex="type" key="type" />
              <Column
                title="Date"
                dataIndex="date"
                key="date"
                render={(value) => <DateFormat value={value} />}
              />
              <Column title="Unit" dataIndex="unit" key="unit" />
              <Column title="Amount" dataIndex="amount" key="amount" />
              <Column
                title="Total"
                dataIndex="total"
                key="total"
                render={(value) =>
                  value && (
                    <React.Fragment>
                      ¥ <NumberFormat value={value} />
                    </React.Fragment>
                  )
                }
              />
            </Table>
          </section>
        </div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: 'center' }}>© 2019</Layout.Footer>
    </Layout>
  );
}
