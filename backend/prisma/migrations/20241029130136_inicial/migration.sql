/*
  Warnings:

  - Added the required column `criadoPor` to the `Chamado` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chamado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataInicial" DATETIME NOT NULL,
    "nome" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "problema" TEXT NOT NULL,
    "numeroTicket" TEXT NOT NULL,
    "dataFinal" DATETIME NOT NULL,
    "criadoPor" TEXT NOT NULL,
    "usuarioId" INTEGER,
    CONSTRAINT "Chamado_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chamado" ("canal", "dataFinal", "dataInicial", "id", "nome", "numeroTicket", "problema", "usuarioId") SELECT "canal", "dataFinal", "dataInicial", "id", "nome", "numeroTicket", "problema", "usuarioId" FROM "Chamado";
DROP TABLE "Chamado";
ALTER TABLE "new_Chamado" RENAME TO "Chamado";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
