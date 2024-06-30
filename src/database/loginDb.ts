import { poolDb } from './poolDb';
import * as syslogDb from './syslogDb';
import {Syslog} from "./syslogDb";
import {RowDataPacket} from "mysql2";

export async function saveRefreshToken(refreshToken: string, id: string) : Promise<void> {
    await poolDb.execute('UPDATE USER SET refresh_token = ? WHERE id = ?', [refreshToken, id]);

    const syslog: Syslog = {
        entity_id: id,
        entity_type: 'USER',
        action: 'UPDATE',
        title: 'Refresh Token Update',
        description: 'Someone logged in and a new refresh token was generated.',
        created_by: id
    }
    await syslogDb.insertSyslog(syslog);
}

export async function selectIdByEmail(email: string) {
    //TODO
}

export async function selectUserPasswordByEmail(email: string) : Promise<string | null> {
    const query = 'SELECT password FROM USER WHERE email = ? AND is_deleted = false';
    const [rows] = await poolDb.query<RowDataPacket[]>(query, [email]);
    return rows[0].password || null;
}