/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NextSeo } from 'next-seo';
import { useState } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from '../redux/reducers';
import { useTranslation } from '../../../i18n';
import ErrorToast from '../common/errorToast';
import Middle from '../Middle';

const store = createStore(
  allReducers
);

const container = css`
  padding: 0;
  background: #44ffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  line-height: normal;
`;

const Dashboard = () => {
  const { t } = useTranslation(['common']);
  const [error, setError] = useState('');

  return (
    <Provider store={store}>
      <>
        <ErrorToast errorMsg={error} setErrorMsg={() => setError('')} width={80} />
        <NextSeo
          title={t('home')}
          description={t('homeDesc')}
        />
        <div css={container}>
          HOME
          <Middle t={t} name="Shreyas" />
        </div>
      </>
    </Provider>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common']
});

export default Dashboard;
