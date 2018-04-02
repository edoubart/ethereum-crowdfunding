// React
import React from 'react';

// Next
import Head from 'next/head';

// Semantic UI
import { Container } from 'semantic-ui-react';

// Custom
import Header from './Header';

export default (props) => {
  return (
    <Container>
      <Head>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
      </Head>
      <Header />
      { props.children }
    </Container>
  );
};
