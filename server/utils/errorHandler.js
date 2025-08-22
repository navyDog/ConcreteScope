



// Middleware de gestion des erreurs pour alleger le code 
function errorHandler(err, req, res, next) {

    console.error('❌ Erreur:', err.message);
    res.status(err.status || 500).json({ 
        error: 'Erreur serveur', 
        details: err.message,
        message: err.message || "Erreur interne du serveur", });
}

module.exports = errorHandler; //si dans un autre fichier 