import { DEMO_OTP_CODE, OTP_RESEND_SEC } from '@/shared/config';

export const authCopy = {
  emailLabel: 'Email для входа',
  emailPlaceholder: 'you@company.ru',
  consent:
    'Даю отдельное согласие на обработку персональных данных для создания аккаунта и входа.',
  submitEmail: 'Получить код на email ↗',
  hint: 'Пароль не нужен. Контакты не публикуются в карточках.',
  otpTitle: 'Код из письма',
  otpHint: 'Введите 6 цифр. Код действует несколько минут.',
  submitOtp: 'Войти ↗',
  resend: 'Отправить код ещё раз',
  resendWait: (sec: number) => `Новый код можно запросить через ${sec} с.`,
  back: 'Изменить email',
  demoHint: `Демо-код: ${DEMO_OTP_CODE}`,
  resendSec: OTP_RESEND_SEC,
} as const;
