import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Select, Button } from 'antd';

export function SellForm({ isSaving, onSubmit }) {
  const [amount, setAmount] = React.useState(10);
  const [fundIndex, setFundIndex] = React.useState(0);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ amount, fundIndex });
      }}
    >
      <Form.Item label="Amount">
        <InputNumber
          disabled={isSaving}
          placeholder="Amount"
          min={1}
          value={amount}
          onChange={setAmount}
        />
      </Form.Item>

      <Form.Item label="Fund">
        <Select
          disabled={isSaving}
          value={String(fundIndex)}
          onChange={(value) => setFundIndex(Number(value))}
        >
          <Select.Option value="0">Fund 1</Select.Option>

          <Select.Option value="1">Fund 2</Select.Option>

          <Select.Option value="2">Fund 3</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button loading={isSaving} type="primary" htmlType="submit">
          Sell
        </Button>
      </Form.Item>
    </Form>
  );
}

SellForm.propTypes = {
  isSaving: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};
