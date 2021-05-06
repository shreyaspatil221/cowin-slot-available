/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';
import useLoading from '../../hooks/useLoading';
import { useTranslation } from '../../../i18n';
import { bookAppointment } from '../service';
import ErrorToast from '../common/errorToast';
import Loader from '../common/loader';

const container = css`
  padding: 0;
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const wrapper = css`
  padding: 1rem;
  background: #fafafa80;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: calc(100vh - 2rem);
  font-size: 1rem;
  text-align: center;
`;

const blue = css`color: blue; font-size: 3rem; padding: 1rem;`;
const red = css`color: red; font-size: 3rem; padding: 1rem;`;

const Dashboard = () => {
  const { t } = useTranslation(['common']);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useLoading(false);

  const payload1 = {
    dose: 1,
    session_id: '306f0c99-5ded-4068-abbc-85314930c94f',
    slot: '02:00PM-04:00PM',
    beneficiaries: [
      '63635946471400'
    ]
  };
  const payload2 = {
    dose: 1,
    session_id: 'f06bfd7e-b721-44f2-bc65-638426667c9b',
    slot: '02:00PM-03:00PM',
    beneficiaries: [
      '63635946471400'
    ]
  };

  const getBooking = async (payload) => {
    setIsLoading(true);
    try {
      const resp = await bookAppointment(payload);
      setResults(resp);
      console.log('results', resp);
    } catch (err) {
      setError(err.message || 'GENERIC_ERROR');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getBooking(payload1);
    getBooking(payload2);
    return () => {};
  }, []);

  // useEffect(() => {
  //   if (!results) {
  //     setInterval(() => {
  //       getBooking(payload1);
  //       getBooking(payload2);
  //     }, 1000);
  //   }
  //   return () => {};
  // }, [results]);

  return (
    <>
      <Loader loading={isLoading.loading} backdrop={isLoading.loading} />
      <ErrorToast errorMsg={error} setErrorMsg={() => setError('')} width={80} />
      <NextSeo
        title={t('home')}
        description={t('homeDesc')}
      />
      <div css={container}>
        <div css={wrapper}>
          {results ? <div css={blue}>SUCCESS</div> : <div css={red}>FAIL</div>}
          <a href="https://selfregistration.cowin.gov.in/appointment">COWIN</a>
        </div>
      </div>
    </>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common']
});

export default Dashboard;
