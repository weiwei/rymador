import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";
import "tailwindcss/tailwind.css";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({
  children,
  title = "Find Rhyming Words in Spanish",
}: Props) => (
  <div className="top-0 p-4 w-full">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="">
      {/* <nav> */}
        {/* <Link href="/">
          <a>Home</a>
        </Link>{" "}
        |{" "} */}
        {/* |{' '}
        <Link href="/users">
          <a>Users List</a>
        </Link>{' '} */}
        {/* | <a href="/api/users">Users API</a> */}
      {/* </nav> */}
    </header>
    {children}
    <footer className="mt-auto">
    <hr className="mt-6 mb-6" />
      <Link href="/about">About</Link>
    </footer>
  </div>
);

export default Layout;
