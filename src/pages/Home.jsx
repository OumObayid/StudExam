import { motion } from "framer-motion";
export default function Home() {
  return (
    <div
      className="d-flex justify-content-center  align-items-center p-3 pt-5 p-md-5"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white border shadow-lg pt-4  px-md-5  text-center" style={{ maxWidth: "800px" }}>
        {/* Logo */}
    

        {/* Titre */}
        <h2 className="text-success mb-4">
          Bienvenue Etudiant chez <span className="text-warning">StudExam</span> <p className="mt-4">👩‍🎓👨‍🎓</p>
        </h2>

        {/* Texte descriptif */}
        <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center  p-4 rounded-2 bg-white"
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      
      <p className="text-muted fs-5 ">
        En tant qu’étudiant, ce site vous permet de passer vos examens en ligne. <br />
        Il vous suffit de vous enregistrer puis de choisir l’examen publié par votre instructeur.
      </p>
    </motion.div>

       
      </div>
    </div>
  );
}
