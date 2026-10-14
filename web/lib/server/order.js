// Sort helpers that put empty (NULL) values where MySQL did, so lists keep
// the order they had before the move to Postgres.
import "server-only";
import { sql } from "drizzle-orm";

export const ascNullsFirst = (column) => sql`${column} asc nulls first`;
export const descNullsLast = (column) => sql`${column} desc nulls last`;
