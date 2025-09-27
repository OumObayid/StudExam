import React from "react";

const Card = ({
  title,
  content,
  footer,
  icon,
  bgColor = "#ffffffff",
  hoverEffect = true,
  className = "",
}) => {
  return (
    <div
      className={`card py-0 shadow-sm border-0 rounded-4 overflow-hidden ${className}`}
      style={{
        backgroundColor: bgColor,
        transition: hoverEffect
          ? "transform 0.8s ease, box-shadow 0.3s ease"
          : "",
      }}
      onMouseEnter={(e) =>
        hoverEffect && (e.currentTarget.style.transform = "scale(1.02)")
      }
      onMouseLeave={(e) =>
        hoverEffect && (e.currentTarget.style.transform = "scale(1)")
      }
    >
      {icon && (
        <div className="card-header d-flex align-items-center py-0">
          <span className="me-2">{icon}</span>
          <h5 className="mb-0">{title}</h5>
        </div>
      )}
      {!icon && title && (
        <div className="card-header">
          <h5 className="mb-0">{title}</h5>
        </div>
      )}
      <div className="card-body">{content}</div>
      {footer && <div className="card-footer bg-light">{footer}</div>}
    </div>
  );
};

export default Card;

//// Exemple d'utilisation:
//  <Card
//   className=""
//   title="Examens à passer"
//   icon={<i className="bi bi-bar-chart fs-4 me-3"></i>}
//   content={<>
//     ...
//    </>
//   }
// />  
