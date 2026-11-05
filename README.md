# ARCHIVES — Mémoires de culture pop

Site éditorial statique consacré à trois œuvres : *Guerre des gangs à Okinawa*
(cinéma), *Kafka sur le rivage* (littérature) et *Crows: The Battle Action*
(rétro-gaming).

## Lancer le site

Deux possibilités :

1. **Double-clic sur `index.html`** — le site fonctionne en local, sans serveur
   (aucune requête réseau, aucune police externe).
2. **Serveur local** (recommandé pour un rendu identique à la vérification) :

   ```powershell
   # depuis le dossier du projet
   powershell -NoProfile -Command "$l=New-Object Net.HttpListener; $l.Prefixes.Add('http://localhost:8787/'); $l.Start(); while($l.IsListening){$c=$l.GetContext(); $p=Join-Path (Get-Location) ($c.Request.Url.LocalPath.TrimStart('/').Replace('/','\'); if($p -eq (Join-Path (Get-Location) '')){$p=Join-Path (Get-Location) 'index.html'}; if(Test-Path $p){$b=[IO.File]::ReadAllBytes($p); $c.Response.OutputStream.Write($b,0,$b.Length)}; $c.Response.Close()}"
   ```

   Puis ouvrir <http://localhost:8787/>.

> Un serveur de test tourne déjà sur <http://localhost:8787/> pendant la session
> de travail.

## Fichiers

```
index.html    structure et vues (accueil, fiche, galerie, visionneuse)
style.css     direction artistique : fonds anthracite, accents rouille / vert
app.js        contenus des fiches, routage, recherche, filtres, favoris, galeries
assets/       documents iconographiques (voir assets/README.md)
```

## Fonctionnalités

- Recherche instantanée (titre, titre original, auteur, année, mots-clés).
- Filtres par catégorie + filtre Favoris.
- Favoris conservés dans `localStorage`.
- Fiches longues avec sommaire collant et lecture suivie.
- Galeries : grille, plein écran, navigation clavier (← →, Échap), retour à la fiche.
- Impression des fiches (`@media print` dédié).
- Responsive (3 colonnes → 2 → 1, navigation compacte sur mobile).

## Images

Le site ne télécharge rien et ne fabrique aucune reproduction. Chaque emplacement
affiche un cadre « Document manquant » tant que le fichier correspondant n'est
pas déposé dans `assets/`. La liste des noms attendus est dans
`assets/README.md`.

## Raccourcis

- `Ctrl+K` ou `/` : aller à la recherche.
- `←` / `→` : document précédent / suivant en plein écran.
- `Échap` : fermer la visionneuse.
