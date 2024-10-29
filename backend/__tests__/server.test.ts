import request from 'supertest';

import cors from 'cors';
import {auth, driver} from 'neo4j-driver';
import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const app = express();
app.use(cors());

// Initialize the Neo4j driver
const neo4jDriver = driver(
    process.env.NEO4J_URI || '',
    auth.basic(process.env.NEO4J_USER || '', process.env.NEO4J_PASSWORD || ''),
    {
        encrypted: "ENCRYPTION_ON",
        trust: "TRUST_ALL_CERTIFICATES"
    }
);

// Mock Neo4j driver session
const mockSession = {
    run: jest.fn().mockResolvedValue({
        records: [
            {
                get: (key: string) => {
                    const data = {
                        name: 'Node1',
                        description: 'This is Node 1',
                        children: ['Child1', 'Child2']
                    };
                    // @ts-ignore
                    return data[key];
                }
            },
            {
                get: (key: string) => {
                    const data = {
                        name: 'Node2',
                        description: 'This is Node 2',
                        children: []
                    };
                    // @ts-ignore
                    return data[key];
                }
            }
        ]
    }),
    close: jest.fn().mockResolvedValue(undefined),
};

// Mock the Neo4j driver
jest.mock('neo4j-driver', () => ({
    driver: jest.fn().mockReturnValue({
        session: () => mockSession,
    }),
    auth: {
        basic: jest.fn(),
    },
}));

app.get('/api/graph', async (req, res) => {
    const session = neo4jDriver.session(); // Use the initialized neo4jDriver here
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

describe('GET /api/graph', () => {
    // Suppress error messages during tests
    beforeAll(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterAll(() => {
        // Restore original console.error
        jest.restoreAllMocks();
    });

    it('should return graph data', async () => {
        const response = await request(app).get('/api/graph');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
            {name: 'Node1', description: 'This is Node 1', children: ['Child1', 'Child2']},
            {name: 'Node2', description: 'This is Node 2', children: []}
        ]);
    });

    it('should return a 500 error on failure', async () => {
        // Simulate a database error
        mockSession.run.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).get('/api/graph');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({error: 'An error occurred while fetching data'});
    });
});

