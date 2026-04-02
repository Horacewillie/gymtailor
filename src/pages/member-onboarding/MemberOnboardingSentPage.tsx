import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MemberOnboardingStepLayout } from "./MemberOnboardingStepLayout";
import { maskEmailForDisplay } from "./maskEmailForDisplay";
import { readEmailGymLocationState } from "./onboardingRouteState";
import styles from "./MemberOnboardingSentPage.module.css";

function MailboxIllustration() {
  return (
    <svg
      className={styles.mailboxIcon}
      width={44}
      height={43}
      viewBox="0 0 44 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M17.1875 26.5625C17.1875 26.9769 17.0229 27.3743 16.7299 27.6674C16.4368 27.9604 16.0394 28.125 15.625 28.125H7.8125C7.3981 28.125 7.00067 27.9604 6.70765 27.6674C6.41462 27.3743 6.25 26.9769 6.25 26.5625C6.25 26.1481 6.41462 25.7507 6.70765 25.4576C7.00067 25.1646 7.3981 25 7.8125 25H15.625C16.0394 25 16.4368 25.1646 16.7299 25.4576C17.0229 25.7507 17.1875 26.1481 17.1875 26.5625ZM29.6875 3.125H34.375C34.7894 3.125 35.1868 2.96038 35.4799 2.66735C35.7729 2.37433 35.9375 1.9769 35.9375 1.5625C35.9375 1.1481 35.7729 0.750671 35.4799 0.457646C35.1868 0.16462 34.7894 0 34.375 0H28.125C27.7106 0 27.3132 0.16462 27.0201 0.457646C26.7271 0.750671 26.5625 1.1481 26.5625 1.5625V7.8125H29.6875V3.125ZM43.75 19.5312V31.25C43.75 32.0788 43.4208 32.8737 42.8347 33.4597C42.2487 34.0458 41.4538 34.375 40.625 34.375H23.4375V40.625C23.4375 41.0394 23.2729 41.4368 22.9799 41.7299C22.6868 42.0229 22.2894 42.1875 21.875 42.1875C21.4606 42.1875 21.0632 42.0229 20.7701 41.7299C20.4771 41.4368 20.3125 41.0394 20.3125 40.625V34.375H3.125C2.2962 34.375 1.50134 34.0458 0.915291 33.4597C0.32924 32.8737 0 32.0788 0 31.25V19.5312C0.00361838 16.4244 1.23943 13.4457 3.43634 11.2488C5.63325 9.05193 8.61185 7.81612 11.7188 7.8125H26.5625V25C26.5625 25.4144 26.7271 25.8118 27.0201 26.1049C27.3132 26.3979 27.7106 26.5625 28.125 26.5625C28.5394 26.5625 28.9368 26.3979 29.2299 26.1049C29.5229 25.8118 29.6875 25.4144 29.6875 25V7.8125H32.0312C35.1381 7.81612 38.1168 9.05193 40.3137 11.2488C42.5106 13.4457 43.7464 16.4244 43.75 19.5312ZM20.3125 19.5312C20.3125 17.252 19.4071 15.0662 17.7955 13.4546C16.1838 11.8429 13.998 10.9375 11.7188 10.9375C9.43955 10.9375 7.25369 11.8429 5.64205 13.4546C4.03041 15.0662 3.125 17.252 3.125 19.5312V31.25H20.3125V19.5312Z"
        fill="#41FFA7"
      />
    </svg>
  );
}

function GmailMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g clipPath="url(#mog-clip)">
        <path
          d="M1.2273 16.021H4.09092V9.06645L0 5.99825V14.7937C0 15.4718 0.549211 16.0211 1.2273 16.0211V16.021Z"
          fill="#4285F4"
        />
        <path
          d="M13.9091 16.021H16.7727C17.4508 16.021 18 15.4718 18 14.7937V5.99825L13.9091 9.06645V16.021Z"
          fill="#34A853"
        />
        <path
          d="M13.9091 3.74825V9.06645L18 5.99825V4.36191C18 2.8452 16.2685 1.97895 15.0545 2.88918L13.9091 3.74825Z"
          fill="#FBBC04"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4.09094 9.06645V3.74825L9.00002 7.4301L13.9091 3.74825V9.06645L9.00002 12.7483L4.09094 9.06645Z"
          fill="#EA4335"
        />
        <path
          d="M0 4.36191V5.99825L4.09092 9.06644V3.74825L2.94546 2.88918C1.73145 1.97894 0 2.84519 0 4.36184V4.36191Z"
          fill="#C5221F"
        />
      </g>
      <defs>
        <clipPath id="mog-clip">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function OutlookMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={18}
      height={18}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g clipPath="url(#moo-c0)">
        <g clipPath="url(#moo-c1)">
          <rect x="5.625" y="1.125" width="11.25" height="15.75" rx="3.2" fill="#1066B5" />
          <rect x="5.625" y="1.125" width="11.25" height="15.75" rx="3.2" fill="url(#moo-p0)" />
          <rect x="5.625" y="2.8125" width="5.625" height="5.625" fill="#32A9E7" />
          <rect x="5.625" y="8.4375" width="5.625" height="5.625" fill="#167EB4" />
          <rect x="11.25" y="8.4375" width="5.625" height="5.625" fill="#32A9E7" />
          <rect x="11.25" y="2.8125" width="5.625" height="5.625" fill="#58D9FD" />
          <mask
            id="moo-mask0"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="4"
            y="7"
            width="14"
            height="10"
          >
            <path
              d="M4.5 7.875H14.8C16.5673 7.875 18 9.30769 18 11.075V13.675C18 15.4423 16.5673 16.875 14.8 16.875H7.7C5.93269 16.875 4.5 15.4423 4.5 13.675V7.875Z"
              fill="url(#moo-p1)"
            />
          </mask>
          <g mask="url(#moo-mask0)">
            <path d="M18 7.875V10.125H16.875V7.875H18Z" fill="#135298" />
            <path d="M18 16.875V9L3.9375 16.875H18Z" fill="url(#moo-p2)" />
            <path d="M4.5 16.875V9L18.5625 16.875H4.5Z" fill="url(#moo-p3)" />
          </g>
          <path
            d="M4.5 8.4375C4.5 6.57354 6.01104 5.0625 7.875 5.0625C9.73896 5.0625 11.25 6.57354 11.25 8.4375V10.3875C11.25 13.0385 9.10097 15.1875 6.45 15.1875H4.5V8.4375Z"
            fill="black"
            fillOpacity={0.3}
          />
          <rect y="3.9375" width="10.125" height="10.125" rx="3.2" fill="url(#moo-p4)" />
          <path
            d="M7.875 9.03895V8.94546C7.875 7.32497 6.70906 6.1875 5.0714 6.1875C3.42484 6.1875 2.25 7.33276 2.25 8.96105V9.05454C2.25 10.675 3.41594 11.8125 5.0625 11.8125C6.70016 11.8125 7.875 10.6672 7.875 9.03895ZM6.54885 9.05454C6.54885 10.1297 5.94363 10.7763 5.0714 10.7763C4.19917 10.7763 3.58505 10.1141 3.58505 9.03895V8.94546C3.58505 7.87033 4.19027 7.22368 5.0625 7.22368C5.92583 7.22368 6.54885 7.88591 6.54885 8.96105V9.05454Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <linearGradient id="moo-p0" x1="5.625" y1="9" x2="16.875" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064484" />
          <stop offset={1} stopColor="#0F65B5" />
        </linearGradient>
        <linearGradient id="moo-p1" x1="4.5" y1="15.0577" x2="18" y2="15.0577" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1B366F" />
          <stop offset={1} stopColor="#2657B0" />
        </linearGradient>
        <linearGradient id="moo-p2" x1="18" y1="12.9375" x2="4.5" y2="12.9375" gradientUnits="userSpaceOnUse">
          <stop stopColor="#44DCFD" />
          <stop offset="0.453125" stopColor="#259ED0" />
        </linearGradient>
        <linearGradient id="moo-p3" x1="4.5" y1="12.9375" x2="18" y2="12.9375" gradientUnits="userSpaceOnUse">
          <stop stopColor="#259ED0" />
          <stop offset={1} stopColor="#44DCFD" />
        </linearGradient>
        <linearGradient id="moo-p4" x1="0" y1="9" x2="10.125" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064484" />
          <stop offset={1} stopColor="#0F65B5" />
        </linearGradient>
        <clipPath id="moo-c0">
          <rect width="18" height="18" fill="white" />
        </clipPath>
        <clipPath id="moo-c1">
          <rect width="18" height="18" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

/**
 * After requesting a magic link — check email + open mail apps.
 * Route: `/member/onboarding/sent` (optional `location.state.email` from confirm step).
 */
export function MemberOnboardingSentPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, gymName } = readEmailGymLocationState(state);

  const masked = email ? maskEmailForDisplay(email) : null;

  const goConfirmStep = useCallback(() => {
    navigate("/member/onboarding/confirm", { state: { email, gymName } });
  }, [email, gymName, navigate]);

  const openMailApp = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const goTrainingIntro = useCallback(() => {
    navigate("/member/onboarding/training-intro", { state: { email, gymName } });
  }, [email, gymName, navigate]);

  const mailApps = [
    { key: "gmail", label: "Gmail", url: "https://mail.google.com/mail/", Icon: GmailMark },
    { key: "outlook", label: "Outlook", url: "https://outlook.live.com/mail/", Icon: OutlookMark },
  ] as const;

  const lead = (
    <>
      {masked != null ? (
        <>
          We&apos;ve sent a secure link to <strong className={styles.leadEmail}>{masked}</strong>.
          Tap it to continue.
        </>
      ) : (
        <>
          We&apos;ve sent a secure link. Open it from your inbox on this device to continue.
        </>
      )}
      <span className={styles.resendRow}>
        <span className={styles.resendMuted}>Didn&apos;t get it? </span>
        <button type="button" className={styles.resendLink} onClick={goConfirmStep}>
          RESEND LINK
        </button>
      </span>
    </>
  );

  const customFooter = (
    <div className={styles.mailSection}>
      <p className={styles.mailAppLabel}>OPEN MAIL APP</p>
      <div className={styles.mailButtonsRow}>
        {mailApps.map(({ key, label, url, Icon }) => (
          <button key={key} type="button" className={styles.mailAppButton} onClick={() => openMailApp(url)}>
            <Icon className={styles.mailIcon} />
            <span className={styles.mailAppButtonLabel}>{label}</span>
          </button>
        ))}
      </div>
      <button type="button" className={styles.continueToSetup} onClick={goTrainingIntro}>
        I&apos;ve opened my email — continue
      </button>
    </div>
  );

  return (
    <MemberOnboardingStepLayout
      onBack={goConfirmStep}
      preTitle={<MailboxIllustration />}
      title="Check Your Email"
      lead={lead}
      customFooter={customFooter}
    />
  );
}
