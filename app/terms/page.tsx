import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { PRICE_LABEL } from '@/lib/config';

export const metadata: Metadata = { title: 'Terms & Refunds' };

const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Refunds" updated="November 2026">
      <section>
        <h2>The service</h2>
        <p>
          BirthdayBliss lets you build an interactive birthday surprise and share it as a private link. Building and
          previewing is free. Getting the shareable link costs {PRICE_LABEL} per surprise, paid once.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <ul>
          <li>You must own, or have permission to use, the photos and words you add.</li>
          <li>Do not upload anything unlawful, hateful, harassing, sexual involving minors, or that violates someone’s privacy.</li>
          <li>We may remove content that breaks these rules without notice or refund.</li>
        </ul>
      </section>

      <section>
        <h2>Music</h2>
        <p>
          Instrumentals are synthesised by the site. Songs offered in the picker are included under the site
          operator’s licences. You may not download, copy or redistribute the music, and it is provided only to play
          within a surprise.
        </p>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Because you can preview the finished surprise before paying, payments are generally final once the link is
          issued. If the link does not work, or you were charged and did not receive a link, contact us and we will fix
          it or refund you in full.{' '}
          {SUPPORT && (
            <>
              Reach us at <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.
            </>
          )}
        </p>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          We aim to keep links working indefinitely but cannot guarantee uninterrupted service. The service is provided
          “as is”, and our liability is limited to the amount you paid.
        </p>
      </section>
    </LegalPage>
  );
}
