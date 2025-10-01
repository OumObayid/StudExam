import "./Public.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { motion } from "framer-motion";
import MyButton from "../../components/button/MyButton"
import { useNavigate } from "react-router-dom";
export default function About() {
  const navigate = useNavigate();

  // Configuration réutilisable pour animer les éléments avec un effet de fade + déplacement vertical
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 }, // déclenche l’animation quand 30% de l’élément est visible
    transition: { duration: 0.8 },
  };

  return (
    <>
      <Navbar />

      <div className="about-page px-2 px-md-0 " style={{ paddingTop: "60px" }}>
        
        {/* Présentation générale de la plateforme */}
        <section className="section-presentation py-5 bg-light">
          <div className="container">
            <div className="row align-items-center justify-content-between">
              
              {/* Image illustrative avec effet d’apparition */}
              <div className="card px-0 col-md-4 mb-4 mb-md-0 d-md-flex">
                <motion.img
                  src="/images/presentation.jpg"
                  alt="Présentation StudExam"
                  className="img-fluid rounded shadow hover-shadow"
                  {...fadeUp}
                />
              </div>

              {/* Texte explicatif placé à droite en version desktop */}
              <div className="col-md-6 text-md-end ">
                <motion.h2 {...fadeUp}>Qui sommes-nous ?</motion.h2>
                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }} // délai pour échelonner l’apparition
                >
                  Bienvenue sur <strong>StudExam</strong>, la plateforme qui
                  permet aux étudiants de passer leurs examens en ligne et
                  suivre leur progression facilement et efficacement.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Section décrivant la mission / l’engagement */}
        <section className="section-mission py-5">
          <div className="container">
            <div className="row justify-content-between align-items-center flex-md-row-reverse">
              
              {/* Image alignée à droite sur écrans larges */}
              <div className="card px-0 col-md-6 mb-4 mb-md-0 d-md-flex justify-content-end">
                <motion.img
                  src="/images/mission.jpg"
                  alt="Notre mission"
                  className="img-fluid rounded shadow"
                  {...fadeUp}
                />
              </div>

              <div className="col-md-6">
                <motion.h2 {...fadeUp}>Notre engagement</motion.h2>
                <motion.p
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: 0.2 }}
                >
                  Fournir une expérience d'examen en ligne fiable, interactive
                  et sécurisée, avec un retour immédiat sur les performances des
                  étudiants.
                </motion.p>
              </div>
            </div>
          </div>
        </section>

        {/* Processus d’utilisation expliqué en 3 étapes */}
        <section className="section-how-it-works py-5 bg-light">
          <div className="container">
            <motion.h2 className="text-center mb-5" {...fadeUp}>
              Fonctionnement
            </motion.h2>
            <div className="row">
              {[
                {
                  title: "Inscription Étudiant",
                  text: "Les étudiants s’inscrivent avec leurs informations personnelles et leur filière.",
                  img: "/images/student-signup.png",
                },
                {
                  title: "Notifications et examens",
                  text: "Les examens disponibles sont notifiés automatiquement sur le dashboard.",
                  img: "/images/exam-notification.png",
                },
                {
                  title: "Passation et résultats",
                  text: "Les étudiants voient leurs scores et statistiques immédiatement après chaque examen.",
                  img: "/images/exam-results.png",
                },
              ].map((item, idx) => (
                <div key={idx} className="col-md-4 mb-4">
                  {/* Carte animée (apparition progressive avec délai selon l’index) */}
                  <motion.div
                    className="card h-100 shadow-sm text-center p-2"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                  >
                    <div className="text-center">
                      <img
                        src={item.img}
                        className="card-img-top w-25"
                        alt={item.title}
                      />
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.text}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Points forts listés sous forme d’icônes et de textes */}
        <section className="section-advantages py-5">
          <div className="container">
            <motion.h2 className="text-center mb-5" {...fadeUp}>
              Nos points forts
            </motion.h2>
            <div className="row text-center">
              {[
                { icon: "bi-speedometer2", title: "Rapide", text: "Examens instantanés" },
                { icon: "bi-shield-lock", title: "Sécurité", text: "Données protégées" },
                { icon: "bi-graph-up", title: "Suivi", text: "Scores et statistiques" },
              ].map((item, idx) => (
                <div key={idx} className="col-md-4 mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: idx * 0.3 }}
                  >
                    <i className={`bi ${item.icon} display-4 text-warning mb-3`}></i>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mise en avant des bénéfices globaux de la plateforme */}
        <section className="section-extra py-5 bg-light">
          <div className="container">
            <motion.h2 className="text-center mb-4" {...fadeUp}>
              Pourquoi StudExam ?
            </motion.h2>
            <motion.p
              className="text-center"
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
            >
              Centralisez vos examens, notifications et résultats dans une
              interface intuitive, adaptée aux étudiants et instructeurs.
            </motion.p>
          </div>
        </section>

        {/* Section finale : Call to Action */}
        <section className="section-cta py-5">
          <div className="container text-center">
            <motion.h2 {...fadeUp}>
              Prêt à commencer vos examens en ligne ?
            </motion.h2>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.2 }}
            >
              Rejoignez StudExam dès maintenant et profitez d'une expérience
              d'examen simplifiée et sécurisée.
            </motion.p>

            {/* Bouton qui redirige vers la page de connexion */}
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.4 }}
            >
              <MyButton
                styleNm={{ backgroundColor: "var(--vert-olive)" }}
                onClick={() => navigate("/login")}
              >
                Commencer
              </MyButton>
            </motion.div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}

