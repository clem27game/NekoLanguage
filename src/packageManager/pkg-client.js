/**
 * Client HTTP pour communiquer avec le serveur de packages NekoScript
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

class PackageClient {
  constructor(options = {}) {
    // Serveur disponible en production (à configurer)
    this.prodServer = 'api.nekoscript.fr';
    
    // Serveur local pour le développement
    this.localServer = 'localhost:5555';
    
    // Si on est en développement ou non
    this.isDevelopment = process.env.NODE_ENV === 'development' || options.development;
    
    // Configuration des options
    this.serverUrl = options.serverUrl || (this.isDevelopment ? this.localServer : this.prodServer);
    this.protocol = this.serverUrl.startsWith('localhost') ? 'http' : 'https';
    this.timeout = options.timeout || 10000; // 10 secondes
  }

  /**
   * Envoie une requête au serveur de packages
   */
  async sendRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = `${this.protocol}://${this.serverUrl}${path}`;
      const protocolModule = this.protocol === 'https' ? https : http;
      
      const options = {
        method: method.toUpperCase(),
        timeout: this.timeout
      };
      
      let postData = '';
      
      if (data && (method === 'POST' || method === 'PUT')) {
        postData = JSON.stringify(data);
        options.headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        };
      }
      
      const req = protocolModule.request(url, options, (res) => {
        let responseData = '';
        
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              // Si c'est un téléchargement, on renvoie le contenu brut
              if (path.includes('/download')) {
                resolve(responseData);
              } else {
                // Sinon on essaie de parser en JSON
                const jsonData = JSON.parse(responseData);
                resolve(jsonData);
              }
            } catch (error) {
              resolve(responseData);
            }
          } else {
            reject(new Error(`Erreur ${res.statusCode}: ${responseData}`));
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Timeout de la requête'));
      });
      
      if (postData) {
        req.write(postData);
      }
      
      req.end();
    });
  }

  /**
   * Liste tous les packages disponibles
   */
  async listPackages(limit = 100, offset = 0, search = '') {
    try {
      const query = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        search
      }).toString();
      
      const response = await this.sendRequest('GET', `/api/packages?${query}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des packages:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations d'un package
   */
  async getPackageInfo(packageName) {
    try {
      const response = await this.sendRequest('GET', `/api/packages/${packageName}`);
      return response.package;
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      console.error(`Erreur lors de la récupération des informations du package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge un package
   */
  async downloadPackage(packageName, version = null) {
    try {
      let path = `/api/packages/${packageName}/download`;
      
      if (version) {
        path += `?version=${version}`;
      }
      
      const response = await this.sendRequest('GET', path);
      return response;
    } catch (error) {
      console.error(`Erreur lors du téléchargement du package ${packageName}:`, error);
      throw error;
    }
  }

  /**
   * Publie un package
   */
  async publishPackage(packageName, content, options = {}) {
    try {
      const data = {
        content,
        language: options.language || 'nekoScript',
        version: options.version || '1.0.0',
        author: options.author || 'Utilisateur NekoScript',
        description: options.description || ''
      };
      
      const response = await this.sendRequest('POST', `/api/packages/${packageName}`, data);
      return response;
    } catch (error) {
      console.error(`Erreur lors de la publication du package ${packageName}:`, error);
      throw error;
    }
  }
}

module.exports = PackageClient;