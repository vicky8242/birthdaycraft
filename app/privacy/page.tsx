import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

const SUPPORT = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 2026">
      <section>
        <h2>What we collect</h2>
        <p>Only what you type into the creator so we can build the surprise:</p>
        <ul>
          <li>Names, nickname, milestone and the messages, notes and letter you write</li>
          <li>The photos you choose to add (resized in your browser before upload)</li>
          <li>Your colour and music choices</li>
        </ul>
        <p className="mt-2">We do not ask you or the recipient to create an account.</p>
      </section>

      <section>
        <h2>Payments</h2>
        <p>
          Payments are handled by Razorpay. Your card, UPI or bank details go directly to Razorpay and are never
          seen or stored by us. We keep only the order and payment reference needed to confirm that you paid.
        </p>
      </section>

      <section>
        <h2>The microphone</h2>
        <p>
          The candle scene asks for microphone access so the recipient can blow out the candle. Audio is analysed
          live in the browser to detect a puff of breath. <strong>It is never recorded, stored or sent anywhere.</strong>{' '}
          If access is declined, the candle can be tapped instead.
        </p>
      </section>

      <section>
        <h2>Who can see a surprise</h2>
        <p>
          Anyone who has the link. Links contain a long random code, are not listed anywhere and are marked so that
          search engines do not index them. Please share yours only with the person you made it for.
        </p>
      </section>

      <section>
        <h2>Storage on your device</h2>
        <p>
          While you build a surprise, the text you entered is saved in your browser (local storage) so you do not
          lose it if you refresh. Photos are not saved there. Clear your browser data to remove it.
        </p>
      </section>

      <section>
        <h2>Deleting a surprise</h2>
        <p>
          {SUPPORT ? (
            <>
              Email <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> with the link and we will delete it, including its photos.
            </>
          ) : (
            <>Contact the site owner with your link and it will be deleted, including its photos.</>
          )}
        </p>
      </section>
    </LegalPage>
  );
}
