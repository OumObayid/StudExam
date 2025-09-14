import { motion } from "framer-motion";
export default function Home() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        backgroundImage: "url(/images/background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white border shadow-lg p-5 text-center" style={{ maxWidth: "800px" }}>
        {/* Logo */}
    

        {/* Titre */}
        <h1 className="text-success mb-4">
          Bienvenue chez <span className="text-warning">ExamenEnLigne</span>
        </h1>

        {/* Texte descriptif */}
        <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center my-5 p-4 rounded-2 bg-white"
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      <h2 className="fw-bold display-6" style={{ color: "#111827" }}>
        Bienvenue étudiant 👩‍🎓👨‍🎓
      </h2>
      <p className="text-muted fs-5 mt-3">
        En tant qu’étudiant, ce site vous permet de passer vos examens en ligne. <br />
        Il vous suffit de vous enregistrer puis de choisir l’examen publié par votre instructeur.
      </p>
    </motion.div>

       
      </div>
    </div>
  );
}
