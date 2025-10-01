import React, { useState } from "react";
import MyButton from "../../components/button/MyButton"

export default function Contact() {
  // État local pour stocker les valeurs saisies dans le formulaire
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Mise à jour dynamique de l'état selon l'input modifié
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Soumission du formulaire : empêche le rechargement, logge les données et réinitialise les champs
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Message envoyé :", formData);
    alert("✅ Merci pour votre message !");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section className="section-auth px-2">
      <div className="form-box-contact">
        <div className="form-value">
          <form onSubmit={handleSubmit} >
            <h2 className="h2-auth ">Contactez-nous</h2>

            {/* Champ texte : Nom */}
            <div className="inputbox">
              <i className="icone-i bi bi-person"></i>
              <input
                value={formData.name}
                onChange={handleChange}
                className="input-auth"
                type="text"
                id="name"
                required
              />
              <label>Votre nom</label>
            </div>

            {/* Champ email avec validation HTML5 */}
            <div className="inputbox">
              <i className="icone-i bi bi-envelope"></i>
              <input
                value={formData.email}
                onChange={handleChange}
                className="input-auth"
                type="email"
                id="email"
                required
              />
              <label>Votre email</label>
            </div>

            {/* Champ sujet libre */}
            <div className="inputbox">
              <i className="icone-i bi bi-pencil"></i>
              <input
                value={formData.subject}
                onChange={handleChange}
                className="input-auth"
                type="text"
                id="subject"
                required
              />
              <label>Sujet</label>
            </div>

            {/* Zone de texte multilignes pour le contenu du message */}
            <div className="inputbox">
              <i className="icone-i icone-textarea bi bi-chat-dots"></i>
              <textarea
                value={formData.message}
                onChange={handleChange}
                className="input-auth"
                id="message"
                rows="4"
                required
              />
              <label className="label-textarea">Message</label>
            </div>

            {/* Bouton personnalisé pour envoyer le formulaire */}
            <MyButton typeNm="submit" classNm="button-auth">
              Envoyer
            </MyButton>
          </form>
        </div>
      </div>
    </section>
  );
}

