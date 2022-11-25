import pgInit from 'pg-promise';

const pgp = pgInit();

export const db = pgp(process.env.REPLICHAT_DB_CONNECTION_STRING!);
const { TransactionMode } = pgp.txMode;

const { isolationLevel } = pgp.txMode;
const mode = new TransactionMode({
    tiLevel: isolationLevel.serializable
});
// Helper to make sure we always access database at serializable level.
export async function tx(f: (t: pgInit.ITask<{}>) => any) {
   
    return await db.tx({mode}, f);
}