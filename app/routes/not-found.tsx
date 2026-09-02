/* This route gives client-side navigation a clear destination when no public page matches. */
import { Link } from "react-router";

import type { Route } from "./+types/not-found";

export const meta: Route.MetaFunction = () => [{ title: "Not Found · Jiaming Zhang" }];

export default function NotFoundPage() {
  return (
    <main className="work-page">
      <article className="work-article">
        <header className="work-opening">
          <p className="role">404</p>
          <h1>Page not found.</h1>
          <p className="work-introduction">The page you requested is not part of this portfolio.</p>
          <Link className="back-link" to="/">← Return home</Link>
        </header>
      </article>
    </main>
  );
}
