# ✅ Checklist des interactions Auréa (V1)

---

## 🧍‍♀️ SECTION : PROFILE

### Si l’utilisateur n’a **jamais rempli son profil**

- [ ] Affichage d’un formulaire de setup initial avec les champs :
  - Date des **dernières règles**
  - Durée moyenne des règles (en jours)
  - Durée moyenne du cycle (en jours)
  - Symptômes récurrents ? (checkbox ou multi-select)
  - Autres infos utiles (âge, contraception, etc.)
- [ ] Bouton **"Enregistrer mes infos"**
- [ ] Message de confirmation / redirection vers le calendrier

### Si l’utilisateur a **déjà rempli son profil**

- [ ] Affichage des infos de profil enregistrées
- [ ] Bouton **"Modifier mon profil"**
  - Ouvre le formulaire avec les données pré-remplies
- [ ] Bouton **"Réinitialiser mon profil"**
  - Ouvre une modale de confirmation
  - Supprime les infos de profil
  - Redirige éventuellement vers la vue initiale du profil

---

## 📅 SECTION : CALENDRIER

### Vue calendrier

- [ ] Affichage visuel du calendrier :
  - Jours de règles (passés)
  - Jours estimés fertiles
  - Jours estimés de PMS
  - Prochaine période estimée
- [ ] Possibilité de **cliquer sur un jour** pour :
  - Voir les infos de ce jour (note, symptôme, etc.)
  - Ajouter une note, une humeur ou un symptôme

### Ajout d’un cycle

- [ ] Bouton **“Ajouter un cycle”**
- [ ] Formulaire d’ajout de cycle :
  - Date de début des règles
  - Date de fin (optionnel ou auto-calculée)
  - Notes (facultatif)
  - Symptômes (checkbox ou multi-select)
  - Humeur (sélecteur ou émojis)
- [ ] Enregistrement du cycle → mise à jour du calendrier
- [ ] Recalcul automatique du cycle moyen

### Édition d’un cycle existant

- [ ] Cliquer sur une entrée du calendrier pour ouvrir une modale
- [ ] Bouton **"Modifier"** pour éditer dates / notes / symptômes
- [ ] Bouton **"Supprimer le cycle"** avec confirmation

---

## 🔐 AUTH & NAVIGATION

- [ ] Authentification via Clerk ou NextAuth :
  - Connexion
  - Inscription
  - Déconnexion
- [ ] Sidebar de navigation (dashboard) avec :
  - Lien vers `Profile`
  - Lien vers `Calendrier`
- [ ] Redirections automatiques :
  - Si non connecté → redirection vers login
  - Si profil incomplet → accès limité au calendrier

---

## 💡 BONUS UX/UI (optionnels)

- [ ] Customisation du thème (ex : avatar, couleurs)
- [ ] Mini-dashboard avec :
  - Moyenne du cycle
  - Dernière période enregistrée
  - Jours restants avant prochaines règles
- [ ] Notifications / rappels de fertilité / PMS (future feature)

---
