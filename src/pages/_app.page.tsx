import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          position: "top-center",
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
