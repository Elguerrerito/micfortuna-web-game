require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ipfyhhovdgnizbkvexcv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' }),
        };
    }

    try {
        const { maletines } = JSON.parse(event.body);

        if (!Array.isArray(maletines) || maletines.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Datos inválidos' }),
            };
        }

        const seed = Date.now();
        const records = maletines.map(({ maletinIndex, id, value }) => ({
            seed,
            maletin_index: maletinIndex,
            maletin_id: id,
            premio: value,
        }));

        const { data, error } = await supabase.from('maletines').insert(records);

        if (error) {
            throw error;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, seed, data }),
        };
    } catch (error) {
        console.error('Error al guardar los maletines:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor' }),
        };
    }
};
