import { ofetch } from 'ofetch';
import * as zlib from 'node:zlib';
import { promisify } from 'node:util';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';
import { AuthManager } from './auth';
import { AifaContainerInfo, AifaContainerInfoResponse, AifaMedicine, DatabaseVersion } from './types';
import { API_BASE_URL } from "./constants";

const gunzip = promisify(zlib.gunzip);

export class AifaClient {
    private auth: AuthManager;
    private cacheDir = path.join(os.tmpdir(), 'aifa-client-cache');
    private dbPath = path.join(this.cacheDir, 'aifa_db.json');
    private versionPath = path.join(this.cacheDir, 'version.txt');
    private database: AifaMedicine[] | null = null;

    constructor(basicToken: string) {
        if (!basicToken) throw new Error('AifaClient requires a Basic Token, get it from the app');
        this.auth = new AuthManager(basicToken);
    }

    private async request<T>(endpoint: string, options: any = {}): Promise<T> {
        const token = await this.auth.getBearerToken();
        return ofetch<T>(endpoint, {
            baseURL: API_BASE_URL,
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        });
    }

    async searchMedicines(query: string): Promise<AifaMedicine[]> {
        const db = await this.fetchDatabase();
        const normalizedQuery = query.toLowerCase();

        return db.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(normalizedQuery)
            )
        );
    }
    
    async getContainerInfo(aic9: string): Promise<AifaContainerInfo | null> {
        const res = await this.request<AifaContainerInfoResponse>(`/mobile/api/confezioni/${aic9}`, {
            method: 'GET',
            responseType: 'json'
        });
        
        return res.dettaglioConfezione || null;
    };

    async getDatabaseVersion(): Promise<string> {
        const res = await this.request<DatabaseVersion>('/mobile/api/medicinali/versione', {
            method: 'GET',
            responseType: 'json'
        });
        return res.version.toString();
    }

    async downloadFullDatabase(): Promise<AifaMedicine[]> {
        const compressedBuffer: ArrayBuffer = await this.request('/mobile/api/medicinali', {
            method: 'GET',
            responseType: 'arrayBuffer',
            headers: {
                'Accept-Encoding': 'gzip',
            }
        });

        const decompressedBuffer = await gunzip(Buffer.from(compressedBuffer));
        const jsonString = decompressedBuffer.toString('utf-8');
        return JSON.parse(jsonString) as AifaMedicine[];
    }

    async fetchDatabase(forceUpdate: boolean = false): Promise<AifaMedicine[]> {
        if (!forceUpdate && this.database) return this.database;

        await fs.mkdir(this.cacheDir, { recursive: true });

        const remoteVersion = await this.getDatabaseVersion();

        if (!forceUpdate) {
            try {
                const localVersion = await fs.readFile(this.versionPath, 'utf-8');
                if (localVersion === remoteVersion) {
                    console.log("The local version is the same as remote")
                    const localData = await fs.readFile(this.dbPath, 'utf-8');
                    this.database = JSON.parse(localData);
                    return this.database!;
                }
            } catch {}
        }

        const data = await this.downloadFullDatabase();

        await fs.writeFile(this.dbPath, JSON.stringify(data));
        await fs.writeFile(this.versionPath, remoteVersion.toString());

        this.database = data;
        return this.database;
    }
}