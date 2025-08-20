// Main Application Class
class ConcreteLabApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.data = {
            chantiers: [],
            affaires: [],
            entreprises: [],
            eprouvettes: []
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.showSection('dashboard');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });

        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.hideModal();
        });

        document.getElementById('modal-overlay').addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.hideModal();
            }
        });

        // Add buttons
        document.getElementById('add-chantier-btn').addEventListener('click', () => {
            this.showAddChantierModal();
        });

        document.getElementById('add-affaire-btn').addEventListener('click', () => {
            this.showAddAffaireModal();
        });

        document.getElementById('add-entreprise-btn').addEventListener('click', () => {
            this.showAddEntrepriseModal();
        });

        document.getElementById('add-eprouvette-btn').addEventListener('click', () => {
            this.showAddEprouvetteModal();
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Tableau de bord',
            chantiers: 'Gestion des Chantiers',
            affaires: 'Gestion des Affaires',
            entreprises: 'Gestion des Entreprises',
            eprouvettes: 'Gestion des Éprouvettes'
        };
        document.getElementById('page-title').textContent = titles[sectionName];

        // Load section data
        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'chantiers':
                await this.loadChantiers();
                break;
            case 'affaires':
                await this.loadAffaires();
                break;
            case 'entreprises':
                await this.loadEntreprises();
                break;
            case 'eprouvettes':
                await this.loadEprouvettes();
                break;
        }
    }

    async loadDashboardData() {
        try {
            const [chantiers, affaires, entreprises, eprouvettes] = await Promise.all([
                this.fetchData('/api/chantiers'),
                this.fetchData('/api/affaires'),
                this.fetchData('/api/entreprises'),
                this.fetchData('/api/eprouvettes')
            ]);

            // Update dashboard stats
            document.getElementById('total-chantiers').textContent = chantiers.length;
            document.getElementById('total-affaires').textContent = affaires.length;
            document.getElementById('total-entreprises').textContent = entreprises.length;
            document.getElementById('total-eprouvettes').textContent = eprouvettes.length;

            // Store data
            this.data.chantiers = chantiers;
            this.data.affaires = affaires;
            this.data.entreprises = entreprises;
            this.data.eprouvettes = eprouvettes;

            // Update recent activities
            this.updateRecentActivities();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showMessage('Erreur lors du chargement des données', 'error');
        }
    }

    async loadChantiers() {
        try {
            const chantiers = await this.fetchData('/api/chantiers');
            this.data.chantiers = chantiers;
            this.renderChantiersTable(chantiers);
        } catch (error) {
            console.error('Error loading chantiers:', error);
            this.showMessage('Erreur lors du chargement des chantiers', 'error');
        }
    }

    async loadAffaires() {
        try {
            const affaires = await this.fetchData('/api/affaires');
            this.data.affaires = affaires;
            this.renderAffairesTable(affaires);
        } catch (error) {
            console.error('Error loading affaires:', error);
            this.showMessage('Erreur lors du chargement des affaires', 'error');
        }
    }

    async loadEntreprises() {
        try {
            const entreprises = await this.fetchData('/api/entreprises');
            this.data.entreprises = entreprises;
            this.renderEntreprisesTable(entreprises);
        } catch (error) {
            console.error('Error loading entreprises:', error);
            this.showMessage('Erreur lors du chargement des entreprises', 'error');
        }
    }

    async loadEprouvettes() {
        try {
            const eprouvettes = await this.fetchData('/api/eprouvettes');
            this.data.eprouvettes = eprouvettes;
            this.renderEprouvettesTable(eprouvettes);
        } catch (error) {
            console.error('Error loading eprouvettes:', error);
            this.showMessage('Erreur lors du chargement des éprouvettes', 'error');
        }
    }

    renderChantiersTable(chantiers) {
        const tbody = document.getElementById('chantiers-table-body');
        
        if (chantiers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fas fa-building"></i>
                            <h3>Aucun chantier</h3>
                            <p>Commencez par créer votre premier chantier</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = chantiers.map(chantier => `
            <tr>
                <td><strong>${chantier.numero}</strong></td>
                <td>${chantier.nom}</td>
                <td>${chantier.affaire_nom || '-'}</td>
                <td>${chantier.entreprise_nom || '-'}</td>
                <td>${this.formatDate(chantier.date_reception)}</td>
                <td>${this.formatDate(chantier.date_prelevement)}</td>
                <td>${chantier.slump || '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="app.editChantier(${chantier.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteChantier(${chantier.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderAffairesTable(affaires) {
        const tbody = document.getElementById('affaires-table-body');
        
        if (affaires.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">
                        <div class="empty-state">
                            <i class="fas fa-folder"></i>
                            <h3>Aucune affaire</h3>
                            <p>Commencez par créer votre première affaire</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = affaires.map(affaire => `
            <tr>
                <td>${affaire.id}</td>
                <td>${affaire.nom}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="app.editAffaire(${affaire.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteAffaire(${affaire.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderEntreprisesTable(entreprises) {
        const tbody = document.getElementById('entreprises-table-body');
        
        if (entreprises.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">
                        <div class="empty-state">
                            <i class="fas fa-industry"></i>
                            <h3>Aucune entreprise</h3>
                            <p>Commencez par créer votre première entreprise</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = entreprises.map(entreprise => `
            <tr>
                <td>${entreprise.id}</td>
                <td>${entreprise.nom}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-secondary btn-sm" onclick="app.editEntreprise(${entreprise.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteEntreprise(${entreprise.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    renderEprouvettesTable(eprouvettes) {
        const tbody = document.getElementById('eprouvettes-table-body');
        
        if (eprouvettes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8">
                        <div class="empty-state">
                            <i class="fas fa-cubes"></i>
                            <h3>Aucune éprouvette</h3>
                            <p>Commencez par créer votre première série d'éprouvettes</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = eprouvettes.map(eprouvette => `
            <tr>
                <td>${eprouvette.chantier_id}</td>
                <td>${this.formatDate(eprouvette.date_creation)}</td>
                <td>${this.formatDate(eprouvette.date_ecrasement)}</td>
                <td>${eprouvette.age_jour || '-'}</td>
                <td>${eprouvette.hauteur || '-'}</td>
                <td>${eprouvette.diametre || '-'}</td>
                <td>${eprouvette.force || '-'}</td>
                <td>${eprouvette.masse || '-'}</td>
            </tr>
        `).join('');
    }

    updateRecentActivities() {
        const activitiesContainer = document.getElementById('recent-activities');
        const activities = [];

        // Add recent chantiers
        this.data.chantiers.slice(0, 3).forEach(chantier => {
            activities.push({
                type: 'chantier',
                text: `Nouveau chantier: ${chantier.nom}`,
                date: chantier.date_reception
            });
        });

        // Add recent affaires
        this.data.affaires.slice(0, 2).forEach(affaire => {
            activities.push({
                type: 'affaire',
                text: `Nouvelle affaire: ${affaire.nom}`,
                date: new Date()
            });
        });

        // Sort by date and take first 5
        activities.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentActivities = activities.slice(0, 5);

        if (recentActivities.length === 0) {
            activitiesContainer.innerHTML = '<p class="text-muted">Aucune activité récente</p>';
            return;
        }

        activitiesContainer.innerHTML = recentActivities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.type === 'chantier' ? 'building' : 'folder'}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.text}</p>
                    <small>${this.formatDate(activity.date)}</small>
                </div>
            </div>
        `).join('');
    }

    // Modal Management
    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-overlay').classList.add('active');
    }

    hideModal() {
        document.getElementById('modal-overlay').classList.remove('active');
    }

    // Add Modals
    showAddChantierModal() {
        const content = `
            <form id="add-chantier-form">
                <div class="form-group">
                    <label for="chantier-nom">Nom du chantier *</label>
                    <input type="text" id="chantier-nom" class="form-control" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="chantier-affaire">Affaire *</label>
                        <select id="chantier-affaire" class="form-control" required>
                            <option value="">Sélectionner une affaire</option>
                            ${this.data.affaires.map(affaire => 
                                `<option value="${affaire.id}">${affaire.nom}</option>`
                            ).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="chantier-entreprise">Entreprise *</label>
                        <select id="chantier-entreprise" class="form-control" required>
                            <option value="">Sélectionner une entreprise</option>
                            ${this.data.entreprises.map(entreprise => 
                                `<option value="${entreprise.id}">${entreprise.nom}</option>`
                            ).join('')}
                        </select>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="chantier-date-reception">Date de réception</label>
                        <input type="date" id="chantier-date-reception" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="chantier-date-prelevement">Date de prélèvement</label>
                        <input type="date" id="chantier-date-prelevement" class="form-control">
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="chantier-slump">Slump</label>
                    <input type="text" id="chantier-slump" class="form-control" placeholder="Ex: 18cm">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">Créer le chantier</button>
                </div>
            </form>
        `;

        this.showModal('Nouveau Chantier', content);
        
        document.getElementById('add-chantier-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createChantier();
        });
    }

    showAddAffaireModal() {
        const content = `
            <form id="add-affaire-form">
                <div class="form-group">
                    <label for="affaire-nom">Nom de l'affaire *</label>
                    <input type="text" id="affaire-nom" class="form-control" required>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">Créer l'affaire</button>
                </div>
            </form>
        `;

        this.showModal('Nouvelle Affaire', content);
        
        document.getElementById('add-affaire-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createAffaire();
        });
    }

    showAddEntrepriseModal() {
        const content = `
            <form id="add-entreprise-form">
                <div class="form-group">
                    <label for="entreprise-nom">Nom de l'entreprise *</label>
                    <input type="text" id="entreprise-nom" class="form-control" required>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">Créer l'entreprise</button>
                </div>
            </form>
        `;

        this.showModal('Nouvelle Entreprise', content);
        
        document.getElementById('add-entreprise-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createEntreprise();
        });
    }

    showAddEprouvetteModal() {
        const content = `
            <form id="add-eprouvette-form">
                <div class="form-group">
                    <label for="eprouvette-chantier">Chantier *</label>
                    <select id="eprouvette-chantier" class="form-control" required>
                        <option value="">Sélectionner un chantier</option>
                        ${this.data.chantiers.map(chantier => 
                            `<option value="${chantier.id}">${chantier.numero} - ${chantier.nom}</option>`
                        ).join('')}
                    </select>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="eprouvette-nb">Nombre d'éprouvettes *</label>
                        <input type="number" id="eprouvette-nb" class="form-control" min="1" value="3" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="eprouvette-jours">Âge en jours *</label>
                        <input type="number" id="eprouvette-jours" class="form-control" min="1" value="28" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.hideModal()">Annuler</button>
                    <button type="submit" class="btn btn-primary">Créer la série</button>
                </div>
            </form>
        `;

        this.showModal('Nouvelle Série d\'Éprouvettes', content);
        
        document.getElementById('add-eprouvette-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createEprouvettes();
        });
    }

    // API Calls
    async createChantier() {
        const formData = {
            nom: document.getElementById('chantier-nom').value,
            affaire_id: document.getElementById('chantier-affaire').value,
            entreprise_id: document.getElementById('chantier-entreprise').value,
            date_reception: document.getElementById('chantier-date-reception').value,
            date_prelevement: document.getElementById('chantier-date-prelevement').value,
            slump: document.getElementById('chantier-slump').value
        };

        try {
            const response = await this.postData('/api/chantiers', formData);
            this.showMessage('Chantier créé avec succès', 'success');
            this.hideModal();
            this.loadChantiers();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating chantier:', error);
            this.showMessage('Erreur lors de la création du chantier', 'error');
        }
    }

    async createAffaire() {
        const formData = {
            nom: document.getElementById('affaire-nom').value
        };

        try {
            const response = await this.postData('/api/affaires', formData);
            this.showMessage('Affaire créée avec succès', 'success');
            this.hideModal();
            this.loadAffaires();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating affaire:', error);
            this.showMessage('Erreur lors de la création de l\'affaire', 'error');
        }
    }

    async createEntreprise() {
        const formData = {
            nom: document.getElementById('entreprise-nom').value
        };

        try {
            const response = await this.postData('/api/entreprises', formData);
            this.showMessage('Entreprise créée avec succès', 'success');
            this.hideModal();
            this.loadEntreprises();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating entreprise:', error);
            this.showMessage('Erreur lors de la création de l\'entreprise', 'error');
        }
    }

    async createEprouvettes() {
        const formData = {
            chantier_id: document.getElementById('eprouvette-chantier').value,
            nb: document.getElementById('eprouvette-nb').value,
            jours: document.getElementById('eprouvette-jours').value
        };

        try {
            const response = await this.postData('/api/eprouvettes', formData);
            this.showMessage('Série d\'éprouvettes créée avec succès', 'success');
            this.hideModal();
            this.loadEprouvettes();
            this.loadDashboardData();
        } catch (error) {
            console.error('Error creating eprouvettes:', error);
            this.showMessage('Erreur lors de la création des éprouvettes', 'error');
        }
    }

    // Utility Methods
    async fetchData(endpoint) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    async postData(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la requête');
            }
            
            return await response.json();
        } catch (error) {
            console.error('POST error:', error);
            throw error;
        }
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Insert at the top of the current section
        const currentSection = document.querySelector('.section.active');
        currentSection.insertBefore(messageDiv, currentSection.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Edit and Delete methods (placeholder for future implementation)
    editChantier(id) {
        this.showMessage('Fonctionnalité d\'édition à implémenter', 'info');
    }

    deleteChantier(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
            this.showMessage('Fonctionnalité de suppression à implémenter', 'info');
        }
    }

    editAffaire(id) {
        this.showMessage('Fonctionnalité d\'édition à implémenter', 'info');
    }

    deleteAffaire(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette affaire ?')) {
            this.showMessage('Fonctionnalité de suppression à implémenter', 'info');
        }
    }

    editEntreprise(id) {
        this.showMessage('Fonctionnalité d\'édition à implémenter', 'info');
    }

    deleteEntreprise(id) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
            this.showMessage('Fonctionnalité de suppression à implémenter', 'info');
        }
    }
}

// Additional CSS for activity items
const additionalCSS = `
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #f1f5f9;
    }
    
    .activity-item:last-child {
        border-bottom: none;
    }
    
    .activity-icon {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        flex-shrink: 0;
    }
    
    .activity-content p {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        color: #374151;
    }
    
    .activity-content small {
        color: #94a3b8;
        font-size: 0.75rem;
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
    }
    
    .text-muted {
        color: #94a3b8;
        font-style: italic;
    }
`;

// Add additional CSS to the document
const style = document.createElement('style');
style.textContent = additionalCSS;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ConcreteLabApp();
}); 