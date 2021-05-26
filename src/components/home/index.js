/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NextSeo } from 'next-seo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import useLoading from '../../hooks/useLoading';
import { useTranslation } from '../../../i18n';
import { appointment } from '../service';
import ErrorToast from '../common/errorToast';
// import Loader from '../common/loader';
import { getQueryStringParameters } from '../../utils/urlUtility';

const container = css`
  padding: 0;
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  line-height: normal;
`;

const wrapper = css`
  padding: 2rem 1rem;
  background: #fafafa80;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: calc(100vh - 2rem);
  font-size: 1rem;
  text-align: center;
`;

const list = css`
  display: flex;
  gap: 2rem;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 2rem 0 0 0;
`;

const card = css`
  gap: 1rem;
  display: flex;
  flex: 1 1 30%;
  flex-direction: column;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 14px rgb(222 212 212);
`;

const gap = css`
  display: flex;
  gap: 1rem;
`;

const blue = css`color: blue; font-size: 12rem; padding: 1rem; font-weight: bold;`;
const red = css`color: red; font-size: 12rem; padding: 1rem;  font-weight: bold;`;
const green = css`background: #d3f1de;`;

const Dashboard = () => {
  const router = useRouter();
  const query = getQueryStringParameters(router.asPath) || {};
  const { t } = useTranslation(['common']);
  const [error, setError] = useState('');
  const [results, setResults] = useState({});
  // const [date, setDate] = useState('');
  const [isAvaliable, setIsAvailable] = useState(false);
  // const [isLoading, setIsLoading] = useLoading(false);

  const formatedDate = (date) => {
    const dateValue = new Date(date);
    const day = dateValue?.getDate();
    const month = dateValue?.getMonth() + 1;
    const year = dateValue?.getFullYear();
    const formatted = `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month}-${year}`;
    return formatted;
  };

  const filterByAge = ({ centers }) => centers?.filter((resp) => (resp?.name.includes('18')));

  const getData = async () => {
    // setIsLoading(true);
    try {
      const dateToday = formatedDate(new Date());
      const { date = null, pincode = null } = query;
      const resp = await appointment({ pincode: pincode || '400607', date: date || dateToday });
      const ageData = filterByAge(resp);
      // console.log('ageData', ageData);
      setResults({ centers: ageData });
      // setResults(resp);
    } catch (err) {
      setError(err.message || 'GENERIC_ERROR');
    }
    // setIsLoading(false);
  };

  // useEffect(() => {
  //   getData();
  //   return () => { };
  // }, []);

  useEffect(() => {
    setInterval(async () => {
      getData();
    }, 5000);
    getData();
    return () => { clearInterval(); };
  }, []);

  // eslint-disable-next-line max-len
  const checkAvailability = ({ centers }) => centers?.some((center) => (
    center?.sessions?.some((session) => session?.available_capacity > 0)
  ));

  const checkSession = ({ sessions }) => sessions?.some((session) => session?.available_capacity > 0);

  useEffect(() => {
    if (results) {
      const res = checkAvailability(results);
      setIsAvailable(res);
    }
    return () => { };
  }, [results]);

  // const dateChange = (e) => {
  //   console.log('date', e.target.valueAsDate);
  //   const date = e.target.valueAsDate;
  //   const dateSelected = formatedDate(date);
  //   console.log('dateSelected', dateSelected);
  //   setDate(dateSelected);
  // };

  return (
    <>
      {/* <Loader loading={isLoading.loading} backdrop={isLoading.loading} /> */}
      <ErrorToast errorMsg={error} setErrorMsg={() => setError('')} width={80} />
      <NextSeo
        title={t('home')}
        description={t('homeDesc')}
      />
      <div css={container}>
        <div css={wrapper}>
          {/* <div>Slot Abailable ?</div> */}
          {isAvaliable ? <div css={blue}>YES</div> : <div css={red}>NO</div>}
          <a href="https://selfregistration.cowin.gov.in/appointment">COWIN</a>
          <div css={list}>
            {results?.centers?.map((center) => (
              <div key={center?.center_id} css={[card, checkSession(center) && green]}>
                <div>{center?.name}</div>
                <div css={gap}>
                  {center?.sessions?.map((session) => (
                    <div key={session?.session_id} css={card}>
                      {session?.slots?.map((slot, i) => (
                        <div key={i}>
                          {slot}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

Dashboard.getInitialProps = async () => ({
  namespacesRequired: ['common']
});

export default Dashboard;
