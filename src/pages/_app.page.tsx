import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import BaseHead from "~/components/BaseHead";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <BaseHead />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            border: "1px solid #713200",
            padding: "1rem",
            color: "#713200",
          },
        }}
      />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
