/* eslint-disable react/display-name */
import { Children } from "react";
import Document, { DocumentContext } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import { ServerStyleSheets } from "@mui/styles";
import createEmotionCache from "../utils/createEmotionCache";

class MyDocument extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const sheets = new ServerStyleSheets();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props) =>
          sheets.collect(<App emotionCache={cache} {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(" ")}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      styles: [
        ...Children.toArray(initialProps.styles),
        ...emotionStyleTags,
        sheets.getStyleElement(),
      ],
    };
  }
}

export default MyDocument;
