'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ru">
      <body style={{ background: '#100018', color: '#fcfcfc', fontFamily: 'sans-serif', padding: 48 }}>
        <h1>Ошибка приложения</h1>
        <button type="button" onClick={reset}>
          Повторить
        </button>
      </body>
    </html>
  );
}
