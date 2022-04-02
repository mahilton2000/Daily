import React, { useState } from 'react';
import getDemoProps from '../lib/demoProps';
import PropTypes from 'prop-types';
import { Intro } from '../components/Prejoin/Intro';
import NotConfigured from '../components/Prejoin/NotConfigured';
import { useRouter } from 'next/router';
import Daily from '../components/Prejoin/Daily';
import Capsule from '../components/Capsule';
import moment from 'moment';
import { useWindowSize } from '../hooks/useWindowSize';
import { getGridSize } from '../lib/getGridSize';

export default function Index({ isConfigured = false, domain }) {
  const router = useRouter();
  const { width } = useWindowSize();

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createRoom = async (startTime, duration, enableTranscription) => {
    setCreating(true);
    const res = await fetch('/api/createRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nbf: moment(startTime).format(),
        expiryMinutes: Number(duration),
      }),
    });
    const resJson = await res.json();

    if (!resJson?.name) {
      setError(resJson?.error || true);
      return false;
    } else {
      await router.push(
        enableTranscription
          ? `/${resJson.name}?trans=true`
          : `/${resJson.name}`,
      );
    }
    setCreating(false);
  };

  return (
    <main>
      {width > 900 && <Daily />}
      <div className="intro">
        <div className="domain">
          <Capsule variant="gray">{domain}.daily.co</Capsule>
        </div>
        {!isConfigured ? (
          <NotConfigured />
        ) : (
          <Intro error={error} creating={creating} onCreate={createRoom} />
        )}
      </div>

      <style jsx>{`
        main {
          height: 100vh;
          display: grid;
          grid-template-columns: ${getGridSize(width)} auto;
          background: var(--gray-wash);
        }
        .intro {
          display: grid;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }
        .domain {
          top: 20px;
          right: 20px;
          margin-left: auto;
          position: absolute;
        }
      `}</style>
    </main>
  );
}

Index.propTypes = {
  isConfigured: PropTypes.bool.isRequired,
  domain: PropTypes.string.isRequired,
};

export async function getStaticProps() {
  const defaultProps = getDemoProps();
  return {
    props: defaultProps,
  };
}
