import "./Public.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import MyButton from "../../components/button/MyButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />

      <div className="home">
        <div className="home-contain d-flex justify-content-center">
          <motion.div
            className="hero-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Bienvenue Etudiant chez{" "}
              <span style={{ color: "var(--dore)" }}>StudExam</span>{" "}
              <p className="mt-4">👩‍🎓👨‍🎓</p>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <p className="text-muted fs-5">
                En tant qu’étudiant, ce site vous permet de passer vos examens
                en ligne. <br />
              </p>
              <MyButton
                styleNm={{ backgroundColor: "var(--vert-olive)" }}
                onClick={() => navigate("/login")}
              >
                Commencer
              </MyButton>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
