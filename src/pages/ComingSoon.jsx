import React, { useEffect } from 'react';

const ORIGINAL_TITLE =
  'Rijschool KlaverDrive | Rijlessen in Delft, Den Haag, Rijswijk, Den Hoorn & omgeving';

export default function ComingSoon() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Binnenkort online';
    return () => {
      document.title = prevTitle === 'Binnenkort online' ? ORIGINAL_TITLE : prevTitle;
    };
  }, []);

  return (
    <div className="coming-soon-root">
      <style>{`
        .coming-soon-root {
          --paper: #f2f0e9;
          --ink: #193b35;
          --muted: #64736a;
          --accent: #d2694a;
          --line: rgba(25, 59, 53, .2);
          color-scheme: light;
          min-width: 320px;
          min-height: 100vh;
          margin: 0;
          color: var(--ink);
          background: var(--paper);
          font-family: "DM Sans", sans-serif;
          box-sizing: border-box;
        }

        .coming-soon-root *,
        .coming-soon-root *::before,
        .coming-soon-root *::after {
          box-sizing: border-box;
        }

        .coming-soon-root .cs-page {
          display: grid;
          min-height: 100vh;
          grid-template-rows: auto 1fr auto;
          padding: 32px clamp(24px, 6vw, 88px) 24px;
        }

        .coming-soon-root .cs-header,
        .coming-soon-root .cs-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .coming-soon-root .cs-top-note,
        .coming-soon-root .cs-footer {
          color: var(--muted);
          font-size: 12px;
        }

        .coming-soon-root .cs-main {
          display: grid;
          width: min(1120px, 100%);
          align-items: center;
          justify-self: center;
          grid-template-columns: 1fr .82fr;
          gap: clamp(40px, 8vw, 112px);
          padding: 64px 0;
        }

        .coming-soon-root .cs-copy {
          max-width: 560px;
        }

        .coming-soon-root .cs-eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 24px;
          color: var(--accent);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .coming-soon-root .cs-eyebrow::before {
          width: 26px;
          height: 1px;
          background: currentColor;
          content: "";
        }

        .coming-soon-root .cs-title {
          max-width: 620px;
          margin: 0;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(48px, 7vw, 88px);
          font-weight: 500;
          line-height: 1.04;
        }

        .coming-soon-root .cs-title span {
          color: var(--accent);
        }

        .coming-soon-root .cs-description {
          max-width: 390px;
          margin: 24px 0 0;
          color: var(--muted);
          font-size: 16px;
          line-height: 1.7;
        }

        @media (max-width: 700px) {
          .coming-soon-root .cs-page {
            padding: 24px 22px 18px;
          }
          .coming-soon-root .cs-top-note {
            max-width: 120px;
            text-align: right;
          }
          .coming-soon-root .cs-main {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 56px 0 42px;
          }
          .coming-soon-root .cs-title {
            font-size: clamp(48px, 13vw, 70px);
          }
          .coming-soon-root .cs-description {
            font-size: 15px;
          }
        }
      `}</style>

      <div className="cs-page">
        <header className="cs-header">
          <div className="cs-top-note">Een nieuwe plek is in de maak</div>
        </header>

        <main className="cs-main">
          <section className="cs-copy" aria-labelledby="page-title">
            <p className="cs-eyebrow">Binnenkort online</p>
            <h1 id="page-title" className="cs-title">
              Er komt iets <span>moois</span> aan.
            </h1>
            <p className="cs-description">
              We werken achter de schermen aan iets nieuws. Nog even geduld, we zijn er bijna.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
