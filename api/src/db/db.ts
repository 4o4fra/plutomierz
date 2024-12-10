import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import path from 'path';

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../pluta.sqlite');

const dbPromise = open({
    filename: dbPath,
    driver: sqlite3.Database
});

export default dbPromise;