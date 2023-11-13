import Link from "next/link";

const Page404 = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-slate-100">
      <h1 className="text-[12rem] font-extrabold tracking-widest text-primary">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-secondary px-4 py-2 text-sm">
        Page Not Found
      </div>
      <button className="mt-5">
        <Link
          className="group relative inline-block text-sm font-medium text-primary focus:outline-none focus:ring active:text-primary-content"
          href="/"
        >
          <span className="absolute inset-0 translate-x-1 translate-y-1 bg-primary transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></span>

          <span className="relative block border border-current bg-accent px-8 py-3 font-bold">
            Return Home
          </span>
        </Link>
      </button>
    </main>
  );
};

export default Page404;
