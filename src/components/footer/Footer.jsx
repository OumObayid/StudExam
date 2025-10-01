import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  // Récupération de l'année actuelle pour l'afficher dynamiquement
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <footer className="footer pb-3 pt-5">
      <div className="container">
        <div className="row text-white text-md-start text-center">

          {/* Colonne 1 : Présentation rapide du site */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6>À propos</h6>
            <p>
              StudExam permet aux étudiants de passer leurs examens en ligne et
              de suivre leur progression facilement et efficacement.
            </p>
          </div>

          {/* Colonne 2 : Navigation interne avec des liens rapides */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6>Liens rapides</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Accueil</Link></li>
              <li><Link to="/about" className="footer-link">À propos</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/login" className="footer-link">Se connecter</Link></li>
            </ul>
          </div>

          {/* Colonne 3 : Coordonnées de contact */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6>Contact</h6>
            <p>Email: support@studexam.com</p>
            <p>Téléphone: +212 6 00 00 00 00</p>
            <p>Adresse: Casablanca, Maroc</p>
          </div>

          {/* Colonne 4 : Liens vers les réseaux sociaux */}
          <div className="col-md-3 mb-4 mb-md-0">
            <h6>Suivez-nous</h6>
            <div className="d-flex justify-content-md-start justify-content-center">
              <a href="#" className="me-3 footer-social"><i className="bi bi-facebook"></i></a>
              <a href="#" className="me-3 footer-social"><i className="bi bi-twitter"></i></a>
              <a href="#" className="me-3 footer-social"><i className="bi bi-instagram"></i></a>
              <a href="#" className="footer-social"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

        </div>

        {/* Bas du footer : copyright dynamique */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0">&copy; {currentYear} Oumaima El Obayid. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
