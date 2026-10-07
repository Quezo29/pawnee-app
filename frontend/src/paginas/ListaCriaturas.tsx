/**
 * paginas/ListaCriaturas.tsx
 * ------------------------------
 * Página de solo lectura: lista todas las criaturas en una <table> de
 * HTML plano, sin ninguna clase de CSS. Maneja los 3 estados: loading,
 * error y empty.
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { obtenerCriaturas } from "../api/criaturasApi";
import { Criatura, TipoCriatura, TIPOS_CRIATURA } from "../tipos";

function claseNivel(nivel: number): string {
  if (nivel >= 7) return "nivel alto";
  if (nivel >= 4) return "nivel medio";
  return "nivel bajo";
}

export function ListaCriaturas() {
  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<TipoCriatura | "">("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCargando(true);
    setError(null);

    obtenerCriaturas(filtroTipo || undefined)
      .then(setCriaturas)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Error al cargar las criaturas.");
      })
      .finally(() => setCargando(false));
  }, [filtroTipo]);

  return (
    <div>
      <h1>Criaturas de Pawnee</h1>

      <div className="filtro">
        <label htmlFor="filtro-tipo">Filtrar por tipo</label>
        <select
          id="filtro-tipo"
          value={filtroTipo}
          onChange={(evento) => setFiltroTipo(evento.target.value as TipoCriatura | "")}
        >
          <option value="">Todos los tipos</option>
          {TIPOS_CRIATURA.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      {cargando && <p>Cargando criaturas...</p>}
      {!cargando && error && <p className="aviso">Ocurrió un error: {error}</p>}
      {!cargando && !error && criaturas.length === 0 && <p>Todavía no hay criaturas registradas.</p>}

      {!cargando && !error && criaturas.length > 0 && (
        <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Nivel de peligro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {criaturas.map((criatura) => (
              <tr key={criatura._id}>
                <td>{criatura.nombre}</td>
                <td>{criatura.tipo}</td>
                <td>
                  <span className={claseNivel(criatura.nivelPeligro)}>{criatura.nivelPeligro}</span>
                </td>
                <td>
                  <span className={`marca ${criatura.estado}`}>{criatura.estado}</span>
                </td>
                <td>
                  <Link to={`/criaturas/${criatura._id}`}>Ver</Link>
                  {" | "}
                  <Link to={`/criaturas/${criatura._id}/editar`}>Editar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}
