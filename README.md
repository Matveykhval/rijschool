# Rijschool KlaverDrive – Beheer & Deployment Overzicht

Dit project bevat de website en beheeromgeving voor **Rijschool KlaverDrive** (`https://klaverdrive.nl`).

---

## 1. Belangrijke Links

- **Publieke website:** [https://klaverdrive.nl](https://klaverdrive.nl)
- **Beheeromgeving (alleen voor beheerder):** [https://klaverdrive.nl/admin](https://klaverdrive.nl/admin) *(of `https://klaverdrive.nl/#/admin`)*
- **Supabase Project Dashboard:** `https://supabase.com/dashboard/project/hpkrcviezcinqzhjzjzb`

---

## 2. Wat kun je direct in `/admin` aanpassen?

Via `/admin` kun je zonder code-aanpassingen direct wijzigen:
1. **Tijdelijke Actie / Korting** (bijv. *Herfstactie* aan/uit, actietitel en actietekst boven de pakketten).
2. **Lespakketten & Prijzen** (pakketten toevoegen, bewerken, verwijderen, "Meest Gekozen"-badge en optionele doorgestreepte *Oude prijs* voor kortingsacties).
3. **Statistieken** (ervaring, slagingspercentage, blokuren, waardering).
4. **Losse Tarieven & Lesduur** (losse rijles, praktijkexamen, tussentijdse toets, lesduur).
5. **Contact- & Bedrijfsgegevens** (telefoonnummer, WhatsApp-nummer, e-mailadres, openingstijden, lesauto, lesgebied, CBR-nummer en KvK-nummer).

---

## 3. Beveiliging & Onderhoud (Checklist)

- **Supabase Signups uitschakelen:** Zorg dat in het Supabase Dashboard onder **Authentication → User Signups** de optie *"Allow new users to sign up"* **UIT** staat. Zo kan alleen jouw eigen beheerdersaccount inloggen op `/admin`.
- **Automatische Supabase Keep-Alive:** De GitHub Action `.github/workflows/supabase-keepalive.yml` pingt de database elke maandag en donderdag automatisch zodat het gratis Supabase-project nooit op pauze springt.

---

## 4. Domein & DNS (Vimexx → GitHub Pages)

In Vimexx DNS voor `klaverdrive.nl`:

| Type | Naam | Waarde / Inhoud |
| :--- | :--- | :--- |
| **A** | `@` *(of leeg)* | `185.199.108.153` |
| **A** | `@` *(of leeg)* | `185.199.109.153` |
| **A** | `@` *(of leeg)* | `185.199.110.153` |
| **A** | `@` *(of leeg)* | `185.199.111.153` |
| **CNAME** | `www` | `<jouw-github-username>.github.io` |

---

## 5. Lokaal Ontwikkelen

```bash
npm install
npm run dev
```

Productie-build testen:
```bash
npm run build
npm run preview
```
