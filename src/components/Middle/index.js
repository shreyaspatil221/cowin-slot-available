/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../redux/actions';

const container = css`
  padding: 0;
  background: #ffff44;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  line-height: normal;
`;

const containerEnd = css`
  padding: 0;
  background: #ff44ff;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  line-height: normal;
`;

const End = ({ t, name }) => {
  const counter = useSelector((state) => state.counter);
  return (
    <div css={containerEnd}>
      <div>{t('end')}</div>
      <div>{name}</div>
      <div>{counter}</div>
    </div>
  );
};

const Middle = ({ t, name }) => {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  return (
    <div css={container}>
      <div>{t('Middle')}</div>
      <div>{name}</div>
      <div>{counter}</div>
      <button type="button" onClick={() => dispatch(increment(5))}>+</button>
      <button type="button" onClick={() => dispatch(decrement(3))}>-</button>
      <End t={t} name={name} />
    </div>
  );
};

export default Middle;
