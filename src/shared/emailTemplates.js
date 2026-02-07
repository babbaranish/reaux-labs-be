// Colors from brand palette
const COLORS = {
  primary: '#FFE500',
  secondary: '#B8B8CC',
  gray: '#8888A0',
  bg: '#2D2D3F',
  darkBg: '#1A1A2E',
};

const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:${COLORS.darkBg};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.darkBg};padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-size:28px;font-weight:800;letter-spacing:3px;color:${COLORS.primary};">REAUX</span><span style="font-size:28px;font-weight:800;letter-spacing:3px;color:${COLORS.secondary};"> Labs</span>
            </td>
          </tr>

          <!-- Main Card -->
          <tr>
            <td style="background-color:${COLORS.bg};border-radius:16px;padding:48px 40px;border:1px solid #3D3D52;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:${COLORS.gray};font-size:12px;margin:0;line-height:1.6;">
                This email was sent by REAUX Labs. Please do not reply to this email.
              </p>
              <p style="color:#555568;font-size:11px;margin:8px 0 0;">
                &copy; ${new Date().getFullYear()} REAUX Labs. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const welcomeEmail = (name, email, password) =>
  layout(`
    <!-- Icon -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="display:inline-block;width:64px;height:64px;background-color:${COLORS.primary};border-radius:50%;line-height:64px;text-align:center;">
        <span style="font-size:28px;">&#128170;</span>
      </div>
    </div>

    <!-- Heading -->
    <h1 style="color:#ffffff;font-size:26px;font-weight:700;text-align:center;margin:0 0 8px;">
      Welcome to the Lab, ${name}!
    </h1>
    <p style="color:${COLORS.secondary};font-size:15px;text-align:center;margin:0 0 32px;">
      Your fitness journey starts now.
    </p>

    <!-- Credentials -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.darkBg};border-radius:10px;padding:20px 24px;margin-bottom:32px;">
      <tr>
        <td>
          <p style="color:${COLORS.gray};font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px;">Your Login Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;">
                <span style="color:${COLORS.gray};font-size:13px;">Email</span>
              </td>
              <td style="padding:6px 0;text-align:right;">
                <span style="color:#ffffff;font-size:13px;font-weight:600;">${email}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;">
                <span style="color:${COLORS.gray};font-size:13px;">Password</span>
              </td>
              <td style="padding:6px 0;text-align:right;">
                <span style="color:#ffffff;font-size:13px;font-weight:600;">${password}</span>
              </td>
            </tr>
          </table>
          <p style="color:${COLORS.gray};font-size:11px;margin:12px 0 0;">We recommend changing your password after first login.</p>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="border-top:1px solid #3D3D52;margin:0 0 32px;"></div>

    <!-- Features -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:40px;vertical-align:top;">
                <div style="width:32px;height:32px;background-color:${COLORS.darkBg};border-radius:8px;text-align:center;line-height:32px;">
                  <span style="font-size:16px;">&#127947;</span>
                </div>
              </td>
              <td style="padding-left:12px;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Track Your Workouts</p>
                <p style="color:${COLORS.gray};font-size:13px;margin:4px 0 0;">Log exercises, monitor your BMI, and watch your progress grow.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:40px;vertical-align:top;">
                <div style="width:32px;height:32px;background-color:${COLORS.darkBg};border-radius:8px;text-align:center;line-height:32px;">
                  <span style="font-size:16px;">&#129367;</span>
                </div>
              </td>
              <td style="padding-left:12px;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Custom Diet Plans</p>
                <p style="color:${COLORS.gray};font-size:13px;margin:4px 0 0;">Follow curated meal plans designed for your fitness goals.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:40px;vertical-align:top;">
                <div style="width:32px;height:32px;background-color:${COLORS.darkBg};border-radius:8px;text-align:center;line-height:32px;">
                  <span style="font-size:16px;">&#127942;</span>
                </div>
              </td>
              <td style="padding-left:12px;">
                <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0;">Join Challenges</p>
                <p style="color:${COLORS.gray};font-size:13px;margin:4px 0 0;">Compete with the community and push your limits.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Divider -->
    <div style="border-top:1px solid #3D3D52;margin:32px 0;"></div>

    <!-- Closing -->
    <p style="color:${COLORS.secondary};font-size:14px;text-align:center;margin:0 0 24px;">
      Open the app and complete your profile to get started.
    </p>

    <!-- Signature -->
    <p style="color:${COLORS.gray};font-size:13px;text-align:center;margin:0;">
      Stay strong,<br><span style="color:${COLORS.primary};font-weight:600;">Team REAUX Labs</span>
    </p>
  `);
