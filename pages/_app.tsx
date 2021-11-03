/* eslint-disable @next/next/no-page-custom-font */
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import { useMakeTheme } from "../hooks/useMakeTheme";
import { useEffect } from "react";

import "@fontsource/roboto/100.css";
import "@fontsource/roboto/100-italic.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/300-italic.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/400-italic.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/500-italic.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/700-italic.css";
import "@fontsource/roboto/900.css";
import "@fontsource/roboto/900-italic.css";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  readonly emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const theme = useMakeTheme();

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <Head>
          <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
          <meta name="theme-color" content={theme.palette.primary.main} />
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
