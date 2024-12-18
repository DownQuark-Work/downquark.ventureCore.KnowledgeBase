import React from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

export const Index = withRouter(function Index({ history }) {
  function handleMenuClick({ key }) {
    history.push(key);
  }

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[location.pathname]}
      style={{ lineHeight: '64px' }}
    >
      <Menu.Item key="/exchange" onClick={handleMenuClick}>
        Exchange
      </Menu.Item>

      <Menu.Item key="/farm" onClick={handleMenuClick}>
        Farm 1
      </Menu.Item>

      <Menu.Item key="/fund" onClick={handleMenuClick}>
        Fund 1
      </Menu.Item>

      <Menu.Item key="/investor" onClick={handleMenuClick}>
        Investor
      </Menu.Item>
    </Menu>
  );
});
