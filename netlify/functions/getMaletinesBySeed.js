require('dotenv').config()
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ipfyhhovdgnizbkvexcv.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Método no permitido' }),
        };
    }

    try {
        const seed = event.queryStringParameters.seed;

        if (!seed) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Seed es requerida' }),
            };
        }

        const { data, error } = await supabase
            .from('maletines')
            .select('maletin_index, maletin_id, premio')
            .eq('seed', seed);

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'No se encontraron maletines para esta seed' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, maletines: data }),
        };
    } catch (error) {
        console.error('Error al obtener los maletines:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno del servidor' }),
        };
    }
};
