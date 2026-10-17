DELETE FROM "Sessao"
WHERE NOT EXISTS (
    SELECT 1 FROM "Usuario" WHERE "Usuario"."id" = "Sessao"."usuarioId"
);

ALTER TABLE "Sessao" ADD CONSTRAINT "Sessao_usuarioId_fkey"
    FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
