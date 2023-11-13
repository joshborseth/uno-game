import React from "react";
import { Card } from "~/components/Card";
import toast from "react-hot-toast";
const ThemeTesting = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card color="red" num="6" type="number" />

      <div className="w-1/2 rounded border-4 border-secondary bg-primary p-6">
        <h1 className="text-primary-content">This is all the primary stuff</h1>
        <button
          className="btn"
          onClick={() => {
            toast("Hello World");
          }}
        >
          Click Me!
        </button>
      </div>
    </div>
  );
};

export default ThemeTesting;
