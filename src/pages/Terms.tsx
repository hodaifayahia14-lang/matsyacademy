import { useTranslation } from "react-i18next";

export default function Terms() {
  const { t } = useTranslation();
  return (
    <div className="bg-background py-12">
      <div className="container max-w-3xl">
        <h1 className="font-display text-3xl font-bold">{t("terms.title")}</h1>
        <div className="prose prose-green mt-8 max-w-none text-muted-foreground dark:prose-invert">
          <h2>1. {t("terms.acceptance")}</h2>
          <p>{t("terms.acceptanceText")}</p>
          <h2>2. {t("terms.accounts")}</h2>
          <p>{t("terms.accountsText")}</p>
          <h2>3. {t("terms.content")}</h2>
          <p>{t("terms.contentText")}</p>
          <h2>4. {t("terms.payment")}</h2>
          <p>{t("terms.paymentText")}</p>
          <h2>5. {t("terms.intellectual")}</h2>
          <p>{t("terms.intellectualText")}</p>
          <h2>6. {t("terms.termination")}</h2>
          <p>{t("terms.terminationText")}</p>
          <h2>7. {t("terms.liability")}</h2>
          <p>{t("terms.liabilityText")}</p>
          <h2>8. {t("terms.contact")}</h2>
          <p>{t("terms.contactText")}</p>
        </div>
      </div>
    </div>
  );
}
