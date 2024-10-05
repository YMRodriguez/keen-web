import { Html, Head, Main, NextScript } from 'next/document';
import { GoogleFonts } from 'next-google-fonts';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <GoogleFonts href="https://fonts.googleapis.com/css2?family=Bellota+Text:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Bellota:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Zen+Loop:ital@0;1&display=swap" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}