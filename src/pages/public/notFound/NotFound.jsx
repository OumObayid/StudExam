import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <section className="notfound" id="notfound">
      <h1 className="title404 text-center">404</h1>
      <div className="cloak__wrapper">
        <div className="cloak__container">
          <div className="cloak"></div>
        </div>
      </div>
      <div className="text-center text-light">
        <h2 className="text-light my-5">Page introuvable</h2>
        <p className="text-center text-light my-5">
          Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
        </p>

        <span className="link404 my-5">
          <Link to="/" className="my-5 fs-4">
            Home
          </Link>
        </span>
      </div>
    </section>
  );
};

export default NotFound;
