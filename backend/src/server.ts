import express from 'express';
import cors from 'cors';
import {driver, auth} from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const neo4jDriver = driver(
    process.env.NEO4J_URI || '',
    auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''),
    {
        encrypted: "ENCRYPTION_ON",
        trust: "TRUST_ALL_CERTIFICATES"
    }
);

app.get('/api/graph', async (req, res) => {
    const session = neo4jDriver.session();
    try {
        const result = await session.run(
            'MATCH (n) OPTIONAL MATCH (n)-[:PARENT_OF]->(c) RETURN n.name AS name, n.description AS description, COLLECT(c.name) AS children'
        );
        const nodes = result.records.map(record => ({
            name: record.get('name'),
            description: record.get('description'),
            children: record.get('children')
        }));
        res.json(nodes);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred while fetching data'});
    } finally {
        await session.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

