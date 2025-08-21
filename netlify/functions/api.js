import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const json = (status, body) => ({ statusCode: status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

export async function handler(event) {
  try {
    const { httpMethod, path, body } = event;
    const segs = (path.replace('/.netlify/functions/api', '') || '/').split('/').filter(Boolean);
    const resource = segs[0] || 'health';
    const id = segs[1];

    if (resource === 'health') return json(200, { ok: true });

    if (resource === 'news') {
      if (httpMethod === 'GET') {
        const rows = await sql`select * from news order by date desc`;
        return json(200, rows);
      }
      if (httpMethod === 'POST') {
        const { title, content, author, date } = JSON.parse(body || '{}');
        const rows = await sql`insert into news (title, content, author, date) values (${title}, ${content}, ${author}, ${date}) returning *`;
        return json(201, rows[0]);
      }
      if (httpMethod === 'PUT' && id) {
        const { title, content, author, date } = JSON.parse(body || '{}');
        const rows = await sql`update news set title=${title}, content=${content}, author=${author}, date=${date} where id=${id} returning *`;
        return json(200, rows[0]);
      }
      if (httpMethod === 'DELETE' && id) {
        await sql`delete from news where id=${id}`;
        return json(204, {});
      }
    }

    if (resource === 'events') {
      if (httpMethod === 'GET') {
        const rows = await sql`select * from events order by date asc`;
        return json(200, rows);
      }
      if (httpMethod === 'POST') {
        const { title, date, time, location, description } = JSON.parse(body || '{}');
        const rows = await sql`insert into events (title, date, time, location, description) values (${title}, ${date}, ${time}, ${location}, ${description}) returning *`;
        return json(201, rows[0]);
      }
      if (httpMethod === 'PUT' && id) {
        const { title, date, time, location, description } = JSON.parse(body || '{}');
        const rows = await sql`update events set title=${title}, date=${date}, time=${time}, location=${location}, description=${description} where id=${id} returning *`;
        return json(200, rows[0]);
      }
      if (httpMethod === 'DELETE' && id) {
        await sql`delete from events where id=${id}`;
        return json(204, {});
      }
    }

    if (resource === 'members') {
      if (httpMethod === 'GET') {
        const rows = await sql`select * from members order by name asc`;
        return json(200, rows);
      }
      if (httpMethod === 'POST') {
        const { name, bio, avatar } = JSON.parse(body || '{}');
        const rows = await sql`insert into members (name, bio, avatar) values (${name}, ${bio}, ${avatar}) returning *`;
        return json(201, rows[0]);
      }
      if (httpMethod === 'PUT' && id) {
        const { name, bio, avatar } = JSON.parse(body || '{}');
        const rows = await sql`update members set name=${name}, bio=${bio}, avatar=${avatar} where id=${id} returning *`;
        return json(200, rows[0]);
      }
      if (httpMethod === 'DELETE' && id) {
        await sql`delete from members where id=${id}`;
        return json(204, {});
      }
    }

    if (resource === 'messages') {
      if (httpMethod === 'GET') {
        const rows = await sql`select * from messages order by date desc`;
        return json(200, rows);
      }
      if (httpMethod === 'POST') {
        const { name, email, message } = JSON.parse(body || '{}');
        const rows = await sql`insert into messages (name, email, message) values (${name}, ${email}, ${message}) returning *`;
        return json(201, rows[0]);
      }
      if (httpMethod === 'DELETE' && id) {
        await sql`delete from messages where id=${id}`;
        return json(204, {});
      }
    }

    return json(404, { error: 'Not found' });
  } catch (e) {
    console.error(e);
    return json(500, { error: 'Server error' });
  }
}


