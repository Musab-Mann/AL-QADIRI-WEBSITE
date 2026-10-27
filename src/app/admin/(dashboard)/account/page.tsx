import { redirect } from 'next/navigation';
import { requireAdmin } from '@/server/require-admin.ts';
import AccountForm from '@/components/admin/AccountForm';
import styles from '../../admin.module.css';

export const revalidate = 0;

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  if (!session) redirect('/admin/login');

  return (
    <>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Admin Account</h1>
          <p className={styles.pageSubtitle}>Change your username or password. Passwords are hashed and never stored in plain text.</p>
        </div>
      </div>
      <div className={styles.card}>
        <AccountForm username={session.username} />
      </div>
    </>
  );
}
