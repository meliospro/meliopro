# 📱 Guide d'Installation et Fichiers Android de SamaTaxi Kaolack

Application Moto-Taxi Kaolack Ville — **200 FCFA chaque 500m** • Casque fourni • Permis vérifié.

---

## 🤖 1. Fichiers Natifs Android Présents dans le Projet (`/android`)

Le projet contient l'arborescence native Android Studio complète prête à l'emploi :

- **`android/app/src/main/AndroidManifest.xml`** : Déclaration officielle du package `com.samataxi.kaolack`, permissions géolocalisation GPS (`ACCESS_FINE_LOCATION`), appels d'urgence, icônes et configuration écran plein.
- **`android/app/src/main/java/com/samataxi/kaolack/MainActivity.java`** : Activité native Android avec WebView optimisée, gestion des permissions GPS en direct et navigation fluide.
- **`android/app/build.gradle`** & **`android/build.gradle`** : Scripts de compilation Gradle (CompileSdk 34, MinSdk 22, TargetSdk 34).
- **`capacitor.config.json`** : Configuration du bridge mobile Android.

---

## 📥 2. Téléchargement Direct du Fichier APK Android (`.apk`)

Vous pouvez télécharger directement le fichier APK sur n'importe quel smartphone Android :
- **Lien direct** : Cliquez sur le bouton vert **« Android (.APK) »** dans l'application ou téléchargez directement depuis `/api/download/apk` (fichier `SamaTaxi-Kaolack.apk`).
- **Archive Android Studio complète** : Téléchargeable depuis `/api/download/android-project` (`SamaTaxi-Kaolack-Android-Studio.zip`).

---

## 🚀 3. Installation Directe 1-Clic sur Téléphone Android (WebAPK Officiel)

1. Ouvrez votre navigateur **Google Chrome** sur votre smartphone Android.
2. Allez sur l'adresse de l'application :
   ```
   https://ais-pre-ogcbu4jsmrfmotc3qcwf3c-619538347104.europe-west2.run.app
   ```
3. Cliquez sur le bouton vert **« Android (.APK) »** puis **« Installer sur l'écran d'accueil Android »** (ou menu Chrome ⋮ > **« Installer l'application »**).
4. Android génère automatiquement l'APK natif et l'installe sur votre téléphone avec son icône jaune et démarre en plein écran.

---

## 💻 4. Compiler l'APK depuis Android Studio

1. Ouvrez **Android Studio**.
2. Cliquez sur **File > Open** et sélectionnez le dossier `android/` de ce projet.
3. Attendez la synchronisation Gradle.
4. Cliquez sur **Build > Build Bundle(s) / APK(s) > Build APK(s)** pour générer votre APK de production signé.
