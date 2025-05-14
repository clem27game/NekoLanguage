const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class PackageRepository {
  constructor() {
    this.homeDir = process.env.HOME || process.env.USERPROFILE;
    this.nekoScriptDir = path.join(this.homeDir, '.nekoscript');
    this.dbPath = path.join(this.nekoScriptDir, 'packages.db');
    
    this.initDatabase();
  }

  initDatabase() {
    if (!fs.existsSync(this.nekoScriptDir)) {
      fs.mkdirSync(this.nekoScriptDir);
    }
    
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
      }
      
      // Create packages table if it doesn't exist
      this.db.run(`
        CREATE TABLE IF NOT EXISTS packages (
          name TEXT PRIMARY KEY,
          version TEXT,
          author TEXT,
          description TEXT,
          content TEXT,
          language TEXT,
          created_at INTEGER,
          updated_at INTEGER
        )
      `);
    });
  }

  async getPackageInfo(packageName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT name, version, author, description, language, created_at, updated_at FROM packages WHERE name = ?',
        [packageName],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(row);
        }
      );
    });
  }

  async downloadPackage(packageName) {
    return new Promise((resolve, reject) => {
      this.db.get(
        'SELECT content FROM packages WHERE name = ?',
        [packageName],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (!row) {
            reject(new Error(`Package ${packageName} not found`));
            return;
          }
          
          resolve(row.content);
        }
      );
    });
  }

  async publishPackage(packageName, packageContent, language, options = {}) {
    const { version = '1.0.0', author = 'Unknown', description = '' } = options;
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      // Check if package already exists
      this.db.get(
        'SELECT name FROM packages WHERE name = ?',
        [packageName],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          
          if (row) {
            // Update existing package
            this.db.run(
              `UPDATE packages SET 
                version = ?, 
                content = ?, 
                language = ?, 
                description = ?, 
                updated_at = ? 
               WHERE name = ?`,
              [version, packageContent, language, description, now, packageName],
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                
                resolve({ packageName, version, updated: true });
              }
            );
          } else {
            // Insert new package
            this.db.run(
              `INSERT INTO packages (
                name, version, author, description, content, language, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [packageName, version, author, description, packageContent, language, now, now],
              (err) => {
                if (err) {
                  reject(err);
                  return;
                }
                
                resolve({ packageName, version, updated: false });
              }
            );
          }
        }
      );
    });
  }

  async searchPackages(query) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT name, version, author, description, language, created_at, updated_at 
         FROM packages 
         WHERE name LIKE ? OR description LIKE ?`,
        [`%${query}%`, `%${query}%`],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(rows);
        }
      );
    });
  }

  async listPackages() {
    return new Promise((resolve, reject) => {
      this.db.all(
        'SELECT name, version, author, description, language FROM packages ORDER BY name',
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          
          resolve(rows);
        }
      );
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = {
  PackageRepository
};
