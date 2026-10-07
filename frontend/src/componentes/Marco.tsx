import { NavLink, Outlet } from "react-router-dom";

const fecha = new Date().toLocaleDateString("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function Marco() {
  return (
    <div className="expediente">
      <header className="membrete">
        <div>
          <p className="ciudad">Ciudad de Pawnee</p>
          <p className="departamento">Parques</p>
          <p className="division">División de fenómenos inexplicables · {fecha}</p>
        </div>
        <p className="sello">
          turno
          <br />
          de
          <br />
          noche
        </p>
      </header>

      <nav className="navegacion">
        <NavLink to="/" end>
          Criaturas
        </NavLink>
        <NavLink to="/avistamientos">
          Avistamientos
        </NavLink>
        <NavLink to="/criaturas/nueva">
          Nuevo expediente
        </NavLink>
      </nav>

      <main className="hoja">
        <Outlet />
      </main>

      <p className="pie">Archivo interno. No dejar el expediente abierto al cerrar el parque.</p>
    </div>
  );
}
