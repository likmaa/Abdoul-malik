type B2BStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envoi d'email générique.
 *
 * Intégration avec Brevo (ex-Sendinblue) via l'API HTTP.
 *
 * - Nécessite `BREVO_API_KEY` et `EMAIL_FROM` dans les variables d'environnement.
 * - Si `BREVO_API_KEY` n'est pas configurée, on log simplement au lieu de lancer une erreur.
 */
async function sendEmail(options: EmailOptions) {
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_FROM || 'EJS Market <no-reply@ejs-market.com>';

  if (!apiKey) {
    console.log(
      '[email:DRY_RUN] BREVO_API_KEY non configurée, email non envoyé. Payload :',
      { from, ...options },
    );
    return;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: from },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[email:ERROR] Échec envoi email via Brevo', {
        status: response.status,
        body: text,
      });
    } else {
      console.log('[email:SUCCESS] Email envoyé via Brevo', {
        to: options.to,
        subject: options.subject,
      });
    }
  } catch (error) {
    console.error('[email:ERROR] Exception lors de l’envoi email', error);
  }
}

export async function sendB2BStatusEmail(options: {
  to: string;
  companyName: string;
  status: B2BStatus;
}) {
  const { to, companyName, status } = options;

  if (status === 'PENDING') {
    // Pas d'email sur simple passage en "PENDING"
    console.log('[email:B2B_STATUS] Statut PENDING, aucun email envoyé.', options);
    return;
  }

  let subject = '';
  let html = '';

  if (status === 'APPROVED') {
    subject = `Votre demande B2B pour ${companyName} a été approuvée !`;
    const loginUrl = `${process.env.NEXTAUTH_URL || ''}/login?callbackUrl=/b2b`;
    html = `
      <p>Bonjour,</p>
      <p>Nous avons le plaisir de vous informer que votre demande de compte grossiste pour <strong>${companyName}</strong> a été <strong>approuvée</strong>.</p>
      <p>Vous pouvez maintenant vous connecter à votre espace B2B pour accéder à nos tarifs préférentiels et passer vos commandes.</p>
      <p>Connectez-vous ici : <a href="${loginUrl}">${loginUrl}</a></p>
      <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
      <p>L'équipe eJS MARKET</p>
    `;
  } else if (status === 'REJECTED') {
    subject = `Mise à jour de votre demande B2B pour ${companyName}`;
    html = `
      <p>Bonjour,</p>
      <p>Nous avons examiné votre demande de compte grossiste pour <strong>${companyName}</strong>.</p>
      <p>Votre demande a été <strong>refusée</strong> pour le moment. Nous vous invitons à nous contacter pour plus de détails ou si vous pensez qu'il s'agit d'une erreur.</p>
      <p>L'équipe eJS MARKET</p>
    `;
  }

  await sendEmail({ to, subject, html });
}

export async function notifyAdminNewB2BRequest(payload: {
  companyName: string;
  email: string;
  phone: string;
  vatNumber: string;
  sector: string;
  annualVolume: string;
}) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail) {
    console.log(
      '[email:ADMIN_B2B] Nouvelle demande B2B (ADMIN_NOTIFICATION_EMAIL non configuré, log uniquement)',
      payload,
    );
    return;
  }

  const subject = `Nouvelle demande B2B de ${payload.companyName}`;
  const html = `
    <p>Bonjour Admin,</p>
    <p>Une nouvelle demande de compte B2B a été soumise :</p>
    <ul>
      <li><strong>Entreprise :</strong> ${payload.companyName}</li>
      <li><strong>Email :</strong> ${payload.email}</li>
      <li><strong>Téléphone :</strong> ${payload.phone}</li>
      <li><strong>Numéro TVA :</strong> ${payload.vatNumber}</li>
      <li><strong>Secteur :</strong> ${payload.sector}</li>
      <li><strong>Volume annuel :</strong> ${payload.annualVolume}</li>
    </ul>
    <p>Vous pouvez traiter cette demande depuis le panel admin.</p>
  `;

  await sendEmail({
    to: adminEmail,
    subject,
    html,
  });
}

