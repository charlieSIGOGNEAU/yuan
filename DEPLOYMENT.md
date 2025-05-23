# Guide de Déploiement de l'API Rails avec Action Cable

## Prérequis sur le Serveur

1. Installation de Redis :
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

2. Vérification de Redis :
```bash
redis-cli ping
# Devrait répondre "PONG"
```

## Configuration de l'Application

1. Dans `config/cable.yml`, configurer la production :
```yaml
production:
  adapter: redis
  url: <%= ENV.fetch("REDIS_URL") { "redis://localhost:6379/1" } %>
  channel_prefix: api_production
```

2. Dans `config/environments/production.rb`, configurer CORS :
```ruby
config.action_cable.allowed_request_origins = ['https://votre-domaine.com']
```

3. Vérifier que la route Action Cable est présente dans `config/routes.rb` :
```ruby
mount ActionCable.server => '/cable'
```

## Installation des Dépendances

1. Installation de Node.js et npm si ce n'est pas déjà fait :
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Installation de yarn :
```bash
sudo npm install -g yarn
```

3. Installation des dépendances JavaScript :
```bash
cd /chemin/vers/votre/api
npm install
yarn install
```

## Variables d'Environnement

Créer un fichier `.env` à la racine du projet avec :
```
REDIS_URL=redis://localhost:6379/1
RAILS_ENV=production
```

## Compilation des Assets

```bash
rails assets:precompile
```

## Démarrage du Serveur

1. Démarrer Redis :
```bash
sudo systemctl start redis-server
```

2. Démarrer l'application Rails :
```bash
rails server -e production
```

## Vérification

1. Vérifier que Redis fonctionne :
```bash
redis-cli ping
```

2. Vérifier que l'application répond :
```bash
curl https://votre-domaine.com/up
```

3. Vérifier que WebSocket fonctionne :
- Ouvrir la console du navigateur
- Vérifier qu'il n'y a pas d'erreurs de connexion WebSocket
- Vérifier que les messages sont bien reçus

## Dépannage

1. Si WebSocket ne fonctionne pas :
- Vérifier les logs Redis : `redis-cli monitor`
- Vérifier les logs Rails : `tail -f log/production.log`
- Vérifier que le pare-feu autorise les connexions WebSocket (port 443)

2. Si les assets ne se chargent pas :
- Vérifier que `rails assets:precompile` a bien été exécuté
- Vérifier les permissions des dossiers `public/assets`

3. Si Redis ne répond pas :
- Vérifier le statut : `sudo systemctl status redis-server`
- Vérifier les logs : `sudo journalctl -u redis-server` 