import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from '@styles';
import { Provider } from 'react-redux';
import { store } from '@store';
import { withRouter } from 'next/router';
import Layout from 'components/Layout';

class MyApp extends App {
	componentDidMount() {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector("#jss-server-side");
		if (jssStyles) {
			jssStyles.parentNode.removeChild(jssStyles);
		}
	}

	render() {
		const { Component, pageProps } = this.props;

		return (
			<>
				<Head>
					<title>Bunny Licores</title>
					<meta property="og:title" content="Bunny Licores" key="title" />
					<meta charSet="utf-8" />
					<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
				</Head>
				<Provider store={store}>
					<ThemeProvider theme={theme}>
						{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
						<CssBaseline />
						<Layout>
							<Component {...pageProps} />
						</Layout>
					</ThemeProvider>
				</Provider>
			</>
		);
	}
}

export default withRouter(MyApp);
