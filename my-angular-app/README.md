# Henri Trip Front

Front-end personnel pour feuilleter, filtrer et raconter mes guides de voyage. J’utilise ce projet autant comme vitrine que comme terrain d’expérimentation pour Angular 17 et ses composants standalone.

## Pile technique
- Angular 17 + Router standalone
- RxJS pour l’orchestration des flux (recherche, cache local)
- HttpClient pour dialoguer avec l’API (voir `src/environments`)
- CSS pur, sans framework, afin de garder la main sur l’identité visuelle

## Lancer le projet
1. Installer les dépendances :
	```bash
	npm install
	```
2. Démarrer le serveur applicatif :
	```bash
	npm start
	```
3. L’API attendue se configure via `src/environments/environment*.ts` (par défaut `http://localhost:3000/api`).

## Scripts utiles
- `npm run test` : lance Karma + Jasmine
- `npm run lint` : vérifie les conventions Angular ESLint
- `npm run build` : build de production (Angular CLI)

## Architecture rapide
- `src/app/components` contient les vues `guide-list` et `guide-detail`
- `src/app/services` encapsule `GuideApiService` (HTTP) et `ServiceGuide` (cache + helpers métier)
- `src/app/models` décrit les structures `Guide`, `Journee`, `Activite`
- `src/assets` stocke l’illustration par défaut et pourra accueillir les futures photos

## Décisions notables
- J’assume 100 % standalone components pour alléger les modules.
- Le cache `BehaviorSubject` dans `ServiceGuide` évite des appels réseau répétés et permet des filtres instantanés.
- Les vues list/detail partagent la même source de vérité (services) pour rester synchronisées.
- Les textes de l’interface sont rédigés en français, avec quelques touches personnelles pour rappeler que ce carnet est d’abord le mien.

## Roadmap personnelle
- Ajouter un mode hors-ligne minimal (IndexedDB) pour garder les guides consultés.
- Exporter un guide en PDF façon carnet relié.
- Intégrer une couche d’analytics légère pour connaître les destinations les plus travaillées.
