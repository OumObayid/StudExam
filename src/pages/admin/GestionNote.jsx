import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectFilieres } from "../../redux/filiereSlice";
import { selectNiveaux } from "../../redux/niveauSlice";
import { selectModules } from "../../redux/moduleSlice";
import { getResultats } from "../../services/resultats";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MyButton from "../../components/button/MyButton";
import PageTitle from "../../components/PageTitle";
import Card from "../../components/Card";
import { MyAlert } from "../../components/myconfirm/MyAlert";

const GestionNote = () => {
  const [resultats, setResultats] = useState([]);
  const [loading, setLoading] = useState(true);

  const filieres = useSelector(selectFilieres);
  const niveaux = useSelector(selectNiveaux);
  const modules = useSelector(selectModules);

  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedMention, setSelectedMention] = useState("");

  // --- Correctif : réinitialiser le module si filière ou niveau devient vide
  useEffect(() => {
    if (!selectedFiliere || !selectedNiveau) {
      setSelectedModule("");
    }
  }, [selectedFiliere, selectedNiveau]);

  useEffect(() => {
    async function fetchResultats() {
      try {
        const data = await getResultats({});
        if (data.success) setResultats(data.resultats);
        console.log("data.resultats :", data.resultats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchResultats();
  }, []);

  const getMention = (note) => {
    if (note < 10) return "Échoué";
    if (note < 12) return "Passable";
    if (note < 14) return "Assez bien";
    if (note < 16) return "Bien";
    return "Très bien";
  };

  const transformedResultats = resultats.map((r) => ({
    ...r,
    NoteSur20: Number(r.NoteSur20),
    Mention: getMention(Number(r.NoteSur20)),
  }));

  const filteredModules = modules.filter(
    (m) =>
      (!selectedFiliere || m.IdFiliere === selectedFiliere) &&
      (!selectedNiveau || Number(m.IdNiveau) === Number(selectedNiveau))
  );

  const filteredResultats = transformedResultats
    .filter(
      (r) =>
        (!selectedFiliere || r.IdFiliere === selectedFiliere) &&
        (!selectedNiveau || Number(r.IdNiveau) === Number(selectedNiveau)) &&
        (!selectedModule || Number(r.IdModule) === Number(selectedModule)) &&
        (!searchNom ||
          r.CinMembre.toLowerCase().includes(searchNom.toLowerCase()) ||
          r.Nom.toLowerCase().includes(searchNom.toLowerCase()) ||
          r.Prenom.toLowerCase().includes(searchNom.toLowerCase())) &&
        (!selectedNote || r.NoteSur20 === Number(selectedNote)) &&
        (!selectedMention ||
          (selectedMention === "Admis"
            ? r.NoteSur20 >= 10
            : r.Mention === selectedMention))
    )
    .sort((a, b) => b.NoteSur20 - a.NoteSur20);

  const exportPDF = () => {
    if (!selectedFiliere || !selectedNiveau || !selectedModule) {
      MyAlert({
        title: "Attention",
        text: "Veuillez sélectionner filière, niveau et module pour exporter le PDF",
        icon: "warning",
      });
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    const filiereNom =
      filieres.find((f) => f.IdFiliere === selectedFiliere)?.NomFiliere || "";
    const niveauNom =
      niveaux.find((n) => Number(n.IdNiveau) === Number(selectedNiveau))
        ?.NomNiveau || "";
    const moduleNom =
      modules.find((m) => Number(m.IdModule) === Number(selectedModule))
        ?.NomModule || "";

    const headerLines = [
      { text: "Résultats", color: [0, 0, 128], fontStyle: "bold", size: 16 },
      {
        text: `Filière: ${filiereNom}`,
        color: [0, 128, 0],
        fontStyle: "normal",
        size: 14,
      },
      {
        text: `Niveau: ${niveauNom}`,
        color: [128, 0, 128],
        fontStyle: "normal",
        size: 14,
      },
      {
        text: `Module: ${moduleNom}`,
        color: [0, 0, 0],
        fontStyle: "normal",
        size: 14,
      },
    ];

    const headerHeight = headerLines.length * 8 + 6;
    doc.setFillColor(230, 230, 250);
    doc.rect(0, 10, pageWidth, headerHeight, "F");

    headerLines.forEach((line, i) => {
      doc.setFontSize(line.size);
      doc.setFont("helvetica", line.fontStyle);
      doc.setTextColor(...line.color);
      doc.text(line.text, margin, 15 + i * 8);
    });

    const imgData = "/images/logo-offpt.png";
    const imgWidth = 25;
    const imgHeight = 25;
    doc.addImage(
      imgData,
      "PNG",
      pageWidth - margin - imgWidth,
      12,
      imgWidth,
      imgHeight
    );

    autoTable(doc, {
      head: [["Cin", "Prénom", "Nom", "Note /20"]],
      body: transformedResultats
        .filter(
          (r) =>
            r.IdFiliere === selectedFiliere &&
            Number(r.IdNiveau) === Number(selectedNiveau) &&
            Number(r.IdModule) === Number(selectedModule)
        )
        .map((r) => [r.CinMembre, r.Prenom, r.Nom, r.NoteSur20.toFixed(2)]),
      startY: 10 + headerHeight + 5,
    });

    doc.save(`Resultats_${filiereNom}_${niveauNom}_${moduleNom}.pdf`);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className=" py-3">
      <PageTitle> Gestion des notes</PageTitle>

      <Card
        className="mb-4"
        title="Filtrer les resultats"
        icon={<i className="bi bi-clipboard-check fs-4 me-3"></i>}
        content={
          <>
            {/* Filtres */}
            <div className="row  g-2">
              <div className="col-12 col-md-4">
                <input
                  type="text"
                  className="form-control px-1 px-md-3"
                  placeholder="Rechercher par cin/nom/prénom"
                  value={searchNom}
                  onChange={(e) => setSearchNom(e.target.value)}
                />
              </div>
              <div className="col-6 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedFiliere}
                  onChange={(e) => setSelectedFiliere(e.target.value)}
                >
                  <option value="">Toutes les filières</option>
                  {filieres.map((f) => (
                    <option key={f.IdFiliere} value={f.IdFiliere}>
                      {f.NomFiliere}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedNiveau}
                  onChange={(e) => setSelectedNiveau(e.target.value)}
                >
                  <option value="">Tous les niveaux</option>
                  {niveaux.map((n) => (
                    <option key={n.IdNiveau} value={n.IdNiveau}>
                      {n.NomNiveau}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <select
                  className="form-select px-1 px-md-3 bg-white"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  disabled={!selectedFiliere || !selectedNiveau}
                >
                  <option value="">Tous les modules</option>
                  {filteredModules.map((m) => (
                    <option key={m.IdModule} value={m.IdModule}>
                      {m.NomModule}
                    </option>
                  ))}
                </select>
              </div>
              {/* Note et Mention */}
              <div className="col-6 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedNote}
                  onChange={(e) => setSelectedNote(e.target.value)}
                >
                  <option value="">Toutes les notes</option>
                  {[
                    ...new Set(
                      transformedResultats.map((r) => Math.round(r.NoteSur20))
                    ),
                  ].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <select
                  className="form-select px-1 px-md-3"
                  value={selectedMention}
                  onChange={(e) => setSelectedMention(e.target.value)}
                >
                  <option value="">Toutes les mentions</option>
                  {[
                    "Admis",
                    "Échoué",
                    "Passable",
                    "Assez bien",
                    "Bien",
                    "Très bien",
                  ].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12  mt-2  d-flex justify-content-between align-items-center">
                <MyButton
                  styleNm={{
                    fontSize: "12px",
                    backgroundColor: "var(--vert-olive)",
                  }}
                  classNm="p-2 px-3"
                  onClick={exportPDF}
                >
                  Exporter PDF
                </MyButton>
                <MyButton
                  titleNm="Réinitialiser les filtres"
                  classNm="p-2"
                  onClick={() => {
                    setSearchNom("");
                    setSelectedNiveau("");
                    setSelectedFiliere("");
                    setSelectedModule("");
                    setSelectedNote("");
                    setSelectedMention("");
                  }}
                >
                  🧹
                </MyButton>
              </div>
            </div>
          </>
        }
      />
      {/* Table Desktop */}
      <div className="table-responsive d-none d-md-block">
        {filteredResultats.length > 0 ? (
          <table
            style={{
              fontSize: "14px",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
              overflow: "hidden",
            }}
            className="table  table-bordered  table-hover table-striped shadow-sm mt-3"
          >
            <thead>
              <tr>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Cin
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Nom
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Prénom
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Filière
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Niveau
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Module
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Examen
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Note
                </th>
                <th
                  style={{ backgroundColor: "var(--marron)", color: "white" }}
                >
                  Mention
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResultats.map((r) => (
                <tr key={r.IdResultat}>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.CinMembre}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.Nom}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.Prenom}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.NomFiliere}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.NomNiveau}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.NomModule}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.DescriptionE}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.NoteSur20.toFixed(2)}
                  </td>
                  <td className={r.NoteSur20 < 10 ? "bg-danger-subtle" : ""}>
                    {r.Mention}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">Aucun résultat</p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="d-block d-md-none mx-0">
        <div className="row">
          {filteredResultats.length > 0 ? (
            filteredResultats.map((r) => (
              <div key={r.IdResultat} className="col-12 mb-3">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {r.Nom} {r.Prenom}
                    </h5>
                    <p className="card-text">
                      <strong>Filière:</strong> {r.NomFiliere}
                    </p>
                    <p className="card-text">
                      <strong>Niveau:</strong> {r.NomNiveau}
                    </p>
                    <p className="card-text">
                      <strong>Module:</strong> {r.NomModule}
                    </p>
                    <p className="card-text">
                      <strong>Examen:</strong> {r.DescriptionE}
                    </p>
                    <p className="card-text">
                      <strong>Note /20:</strong> {r.NoteSur20.toFixed(2)}
                    </p>
                    <p className="card-text">
                      <strong>Mention:</strong> {r.Mention}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun résultat</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionNote;
