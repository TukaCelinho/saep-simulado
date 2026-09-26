require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;

app.post('/equipamentos', async (req, res) => {
    const { nome, tipo, marca, problema_relatado, status } = req.body;

    const { data, error } = await supabase
        .from('equipamentos')
        .insert([{ nome, tipo, marca, problema_relatado, status: status || 'Em análise' }])
        .select();

    if (error) {
        console.log (error)
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Equipamento cadastrado com sucesso!', data: data[0] });
});

app.get('/equipamentos', async (req, res) => {
    const { data, error } = await supabase
        .from('equipamentos')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.json(data);
});

app.get('/equipamentos/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('equipamentos')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return res.status(404).json({ message: 'Equipamento não encontrado.' });
    }

    return res.json(data);
});

app.put('/equipamentos/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, tipo, marca, problema_relatado, status } = req.body;

    const { data, error } = await supabase
        .from('equipamentos')
        .update({ nome, tipo, marca, problema_relatado, status })
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Equipamento não encontrado.' });
    }

    return res.json({ message: 'Equipamento atualizado com sucesso!', data: data[0] });
});

app.delete('/equipamentos/:id', async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('equipamentos')
        .delete()
        .eq('id', id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Equipamento não encontrado.' });
    }

    return res.json({ message: 'Equipamento excluído com sucesso!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});