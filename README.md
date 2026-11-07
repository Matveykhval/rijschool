# Rijschool KlaverDrive – E-mail Setup (Vimexx Zonder Hostingpakket)

Omdat je bij **Vimexx** alleen de domeinnaam (`klaverdrive.nl`) hebt zonder hostingpakket, kun je **ImprovMX** (100% gratis voor 1 domein) gebruiken om alle e-mails die naar `info@klaverdrive.nl` worden gestuurd automatisch door te sturen naar `karahan_kizil@hotmail.com`.

---

## Deel 1: Inkomende e-mail doorsturen (`info@klaverdrive.nl` → `karahan_kizil@hotmail.com`)

### Stap 1: Maak een gratis ImprovMX account aan
1. Ga naar [https://improvmx.com](https://improvmx.com).
2. Vul bij **Domain name** in: `klaverdrive.nl`
3. Vul bij **Your email address** in: `karahan_kizil@hotmail.com`
4. Klik op **Create a free alias** en bevestig je account via de link in je Hotmail-inbox.

### Stap 2: Voeg de DNS-records toe in Vimexx
1. Log in op [https://www.vimexx.nl](https://www.vimexx.nl) → ga naar **Mijn Domeinen** → klik op **Beheren** naast `klaverdrive.nl`.
2. Scroll naar beneden naar **DNS beheer / DNS wijzigen**.
3. Voeg de volgende **2 MX-records** en **1 TXT-record** toe op het hoofddomein (laat het linker `Naam`-veld leeg of zet er `@` in, afhankelijk van wat Vimexx toont voor het hoofddomein):

| Type | Naam (Subdomein) | Prioriteit | Waarde / Inhoud |
| :--- | :--- | :--- | :--- |
| **MX** | *(leeg laten of `@`)* | `10` | `mx1.improvmx.com.` *(let op: als Vimexx vraagt om geen punt aan het eind, laat de laatste punt weg)* |
| **MX** | *(leeg laten of `@`)* | `20` | `mx2.improvmx.com.` |
| **TXT** | *(leeg laten of `@`)* | — | `v=spf1 include:spf.improvmx.com ~all` |

> **Let op bij bestaande MX-records op het hoofddomein:**
> Als er in Vimexx al oude standaard MX-records staan op het hoofddomein (waar het linker `Naam`-veld leeg is), verwijder die dan. **Laat het MX-record van Resend (`send`) wél gewoon staan!** Die heeft als naam `send` en stoort ImprovMX dus niet.

4. Klik onderaan in Vimexx op **Opslaan**.
5. Wacht 2 tot 5 minuten en klik in je ImprovMX-dashboard op **Check Again**. Zodra alles groen is (**Email forwarding active**), komt elke mail naar `info@klaverdrive.nl` (en elk ander adres `@klaverdrive.nl`) direct binnen op `karahan_kizil@hotmail.com`!

---


