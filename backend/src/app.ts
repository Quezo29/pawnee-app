/**
 * app.ts
 * ------
 * Ensambla Express: middlewares globales, rutas de ambas colecciones,
 * y el middleware centralizado de errores al final.
 */

import fs from "fs";
import path from "path";
import express, { Express, Request, Response } from "express";
import { requestId } from "./middlewares/requestId";
import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";
import { criaturasRouter } from "./routes/criaturas.routes";
import { avistamientosRouter } from "./routes/avistamientos.routes";
import { ApiError } from "./apiError";

// En Render, Express sirve el build de Vite. En desarrollo ese build no
// existe y el frontend sigue corriendo con `npm run dev` (puerto 5173).
const frontendDist = path.resolve(__dirname, "../../frontend/dist");

export function crearApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(requestId);
  app.use(logger);

  app.get("/api/salud", (req: Request, res: Response) => {
    res.json({ estado: "ok", requestId: req.id });
  });

  app.use("/api/criaturas", criaturasRouter);
  app.use("/api/avistamientos", avistamientosRouter);

  app.use("/api", (req: Request, _res: Response, next) => {
    next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
  });

  if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));
    app.get("*", (_req: Request, res: Response, next) => {
      res.sendFile(path.join(frontendDist, "index.html"), (error) => {
        if (error) next(error);
      });
    });
  }

  app.use(errorHandler);

  return app;
}
