import { getSettings, getWhatsAppConfigStatus } from '@/server/settings.ts';
import SettingsForm from '@/components/admin/SettingsForm';
import WhatsAppForm from '@/components/admin/WhatsAppForm';
import styles from '../../admin.module.css';

export const revalidate = 0;

export default function AdminSettingsPage() {
  const settings = getSettings();
  const whatsapp = getWhatsAppConfigStatus();

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
        </div>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Order timing</p>
        <SettingsForm etaMinutes={settings.etaMinutes} />
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>WhatsApp notifications</p>
        {whatsapp.configured ? (
          <span className={`${styles.badge} ${styles.badgeGood}`}>Automatic: new orders go to {whatsapp.destinationNumber}</span>
        ) : (
          <span className={`${styles.badge} ${styles.badgeMuted}`}>
            Number set to {whatsapp.destinationNumber}. Add the API token to send orders automatically
          </span>
        )}
        <div style={{ marginTop: '1rem' }}>
          <WhatsAppForm
            number={settings.whatsappNumber}
            tokenSaved={whatsapp.tokenSaved}
            phoneNumberIdSaved={whatsapp.phoneNumberIdSaved}
            fromEnvironment={whatsapp.fromEnvironment}
          />
        </div>
      </div>
    </>
  );
}
