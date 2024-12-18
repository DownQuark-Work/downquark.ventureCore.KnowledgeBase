import React from 'react';
import { Layout, Table, Divider, Modal } from 'antd';
import { NumberFormat, numberFormatter } from '../../components/number-format';
import { DateFormat } from '../../components/date-format';
import { Address } from '../../components/address';
import { SellForm } from './components/sell-form';
import { funds } from '../../domains/funds';
import { farmWorkflows } from '../../workflows/farm';
import { useFarms } from './hooks/use-farms';
import { useTransactions } from './hooks/use-transactions';
import { useBalance } from './hooks/use-balance';

const { Column, ColumnGroup } = Table;

export function Farm() {
  const { farmsState, loadFarms } = useFarms();
  const { transactionsState, loadTransactions } = useTransactions();
  const { balanceState, loadBalance } = useBalance();
  const [sellModalState, setSellModalState] = React.useState({
    isOpen: false,
  });
  const [sellState, setSellState] = React.useState('idle');

  if (transactionsState.dataState === 'idle') {
    loadTransactions();
  }

  if (farmsState.dataState === 'idle') {
    loadFarms();
  }

  if (balanceState.dataState === 'idle') {
    loadBalance();
  }

  function handleSell({ amount, fundIndex }) {
    setSellState('loading');

    farmWorkflows
      .sell({ amount, fund: funds[fundIndex] })
      .then(() => {
        loadFarms();
        loadTransactions();
        setSellModalState({ isOpen: false });
        setSellState('loaded');
      })
      .catch((error) => {
        setSellState('failed');
        console.error(error);
        alert('Something went wrong, please try again');
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
            Contract: ¥ <NumberFormat value={balanceState.contract} />
          </div>
          <div style={{ padding: '0 1em' }}>
            Wallet balance: ¥ <NumberFormat value={balanceState.wallet} />
          </div>
          <div style={{ padding: '0 1em' }}>
            Max asset valuation: ¥ 820,000,000.00
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
          <Table
            loading={farmsState.dataState === 'loading'}
            dataSource={farmsState.data}
          >
            <ColumnGroup title="Units distribution">
              <Column title="Name" dataIndex="name" key="name" />
              <Column
                title="Supply"
                dataIndex="supply"
                key="supply"
                render={(value, record) => (
                  <React.Fragment>
                    <NumberFormat value={value} />
                    <br />
                    {record.key === '1' && (
                      <React.Fragment>
                        <a href="javascript:;">Buy</a>
                        <Divider type="vertical" />
                        <a
                          href="javascript:;"
                          onClick={() => setSellModalState({ isOpen: true })}
                        >
                          Sell
                        </a>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              />
            </ColumnGroup>
            <Column
              title="Undistributed income"
              dataIndex="undistributedIncome"
              key="undistributedIncome"
              render={(value, record) => (
                <React.Fragment>
                  ¥ <NumberFormat value={value} />
                  <br />
                  {record.key === '1' && <a href="javascript:;">Withdraw</a>}
                </React.Fragment>
              )}
            />
          </Table>

          <section>
            <h2>Transactions log</h2>
            <Table
              loading={transactionsState.dataState === 'loading'}
              dataSource={transactionsState.data.concat([
                {
                  transactionHash:
                    '0x41a8a36b9309764376f532c02b4833367c040d2ca07db9ae84858eae133859q1',
                  type: 'Income withdrawed',
                  date: new Date(),
                  amount: 5000,
                },
                {
                  transactionHash:
                    '0xa4c8a36b9309764376f532c02b4833367c040d2ca07db9ae84858eae13385e93',
                  type: 'Income received',
                  date: new Date(),
                  amount: 9000,
                },
              ])}
            >
              <Column
                title="Transaction"
                dataIndex="transactionHash"
                key="transactionHash"
                render={(txHash) => (
                  <a
                    href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <Address address={txHash} />
                  </a>
                )}
              />
              <Column title="Operation type" dataIndex="type" key="type" />
              <Column
                title="Date"
                dataIndex="date"
                key="date"
                render={(value) => <DateFormat value={value} />}
              />
              <Column
                title="Amount"
                dataIndex="amount"
                key="amount"
                render={(value, record) => {
                  if (
                    ['Income received', 'Income withdrawed'].includes(
                      record.type,
                    )
                  ) {
                    return `¥ ${numberFormatter.format(value)}`;
                  }

                  return numberFormatter.format(value);
                }}
              />
            </Table>
          </section>
        </div>
      </Layout.Content>

      <Layout.Footer style={{ textAlign: 'center' }}>© 2019</Layout.Footer>

      <Modal
        title="Sell units"
        visible={sellModalState.isOpen}
        footer={null}
        onCancel={() => setSellModalState({ isOpen: false })}
      >
        <SellForm isSaving={sellState === 'loading'} onSubmit={handleSell} />
      </Modal>
    </Layout>
  );
}
