import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={inter.className}>
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
    </div>
  );
};

export default api.withTRPC(MyApp);
