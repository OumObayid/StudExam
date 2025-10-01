import { motion } from "framer-motion";
import "./Public.css"
export default function Home() {
  return (
    <div
      className="home d-flex justify-content-center  align-items-center mx-3 p-3  p-md-5"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className=" px-md-5  text-center"
        style={{ maxWidth: "800px" }}
      >
     
        <h3 className="text-success mb-0 py-4">
          Bienvenue Etudiant chez <span style={{color:"var(--dore)"}}>StudExam</span>{" "}
          <p className="mt-4">👩‍🎓👨‍🎓</p>
        </h3>

        {/* Texte descriptif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center   rounded-2 "
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <p className="text-muted fs-6 ">
            En tant qu’étudiant, ce site vous permet de passer vos examens en
            ligne. <br />
            Il vous suffit de vous enregistrer puis de choisir l’examen publié
            par votre instructeur.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
