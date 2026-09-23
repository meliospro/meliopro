# 📱 Guide d'Installation et Téléchargement de SamaTaxi en APK

Application Moto-Taxi Sénégal — **200 FCFA chaque 500m** • Casque fourni • Permis vérifié.

---

## 🚀 Option 1 : Installation Directe sur Téléphone Android (WebAPK Officiel)

Vous n'avez pas besoin d'installer manuellement un fichier inconnu : Android intègre directement la technologie **WebAPK**.

1. Ouvrez votre navigateur **Google Chrome** sur votre smartphone Android.
2. Allez sur l'adresse de l'application :
   ```
   https://ais-pre-ogcbu4jsmrfmotc3qcwf3c-619538347104.europe-west2.run.app
   ```
3. Cliquez sur le bouton jaune **« Installer l’application APK »** ou appuyez sur les **3 petits points ⋮** en haut à droite de Chrome > **« Installer l'application »** (ou *Ajouter à l'écran d'accueil*).
4. Android génère automatiquement l'APK natif et l'installe sur votre téléphone.
5. L'application apparaît dans votre tiroir d'applications Android avec son icône, son splashscreen jaune Dakar et s'ouvre en plein écran sans barre d'URL.

---

## 📦 Option 2 : Obtenir le fichier `.APK` / `.AAB` avec PWABuilder (Recommandé pour Google Play)

**PWABuilder** est le service officiel open-source (soutenu par Google et Microsoft) pour convertir une PWA conforme en fichier APK autonome ou Android App Bundle (`.aab`) pour le Google Play Store.

1. Rendez-vous sur **[PWABuilder.com](https://www.pwabuilder.com/)**.
2. Entrez l'URL publique de SamaTaxi :
   ```
   https://ais-pre-ogcbu4jsmrfmotc3qcwf3c-619538347104.europe-west2.run.app
   ```
3. Cliquez sur **« Start »** puis sur **« Package for Stores »**.
4. Sélectionnez **Android** :
   - Choisissez **« Download APK »** pour installer directement le fichier `.apk` sur n'importe quel smartphone Android.
   - Ou choisissez **« Download AAB »** pour publier l'application sur la **Google Play Console**.

---

## 💻 Option 3 : Compiler le fichier APK en ligne de commande (Bubblewrap CLI)

Pour les développeurs ayant Node.js et l'Android SDK :

```bash
# 1. Initialiser le projet Android TWA avec le manifest
npx @bubblewrap/cli init --manifest https://ais-pre-ogcbu4jsmrfmotc3qcwf3c-619538347104.europe-west2.run.app/manifest.json

# 2. Compiler l'APK signé
npx @bubblewrap/cli build
```

Le fichier `app-release-signed.apk` sera généré dans votre dossier de sortie, prêt à être transféré sur n'importe quel smartphone par WhatsApp, câble USB ou téléchargement direct.
