import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import BaseHead from "~/components/BaseHead";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <BaseHead />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
