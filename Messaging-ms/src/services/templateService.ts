import * as fs from 'fs';

export class TemplateService {
    static getTemplate(templateType: string | undefined, content: string):  {
        html: string;
        attachments: Array<{
          filename: string;
          content: any;
          cid: string;
        }>;
      } {
      switch (templateType) {
        case 'otp':
          return {
            html:`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Tow Naija Account</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #021639; font-family: Arial, sans-serif; color: #ffffff;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #021639; padding: 20px;">
                                <!-- Logo -->
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <img src="cid:logo" alt="Logo" style="max-width: 100px; height: auto;">
                                    </td>
                                </tr>
                                
                                <!-- Header Text -->
                                <tr>
                                    <td align="center" style="color: #F2D41E; font-size: 20px; font-weight: bold; padding-bottom: 20px;">
                                        Verify Otp
                                    </td>
                                </tr>

                                <!-- Greeting -->
                                <tr>
                                    <td style="color: #ffffff; font-size: 16px; padding: 10px 40px;">
                                        <p>Otp incoming, please use the following one-time verification code:</p>
                                    </td>
                                </tr>

                                <!-- OTP Code -->
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <table cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <!-- First Digit -->
                                                <td style="background-color: #ffc107; color: #041c44; font-size: 24px; font-weight: bold; text-align: center; padding: 15px 20px; border-radius: 5px;">${content[0]}</td>
                                                <!-- Spacer -->
                                                <td style="width: 8px;"></td>
                                                <!-- Second Digit -->
                                                <td style="background-color: #ffc107; color: #041c44; font-size: 24px; font-weight: bold; text-align: center; padding: 15px 20px; border-radius: 5px;">${content[1]}</td>
                                                <!-- Spacer -->
                                                <td style="width: 8px;"></td>
                                                <!-- Third Digit -->
                                                <td style="background-color: #ffc107; color: #041c44; font-size: 24px; font-weight: bold; text-align: center; padding: 15px 20px; border-radius: 5px;">${content[2]}</td>
                                                <!-- Spacer -->
                                                <td style="width: 8px;"></td>
                                                <!-- Fourth Digit -->
                                                <td style="background-color: #ffc107; color: #041c44; font-size: 24px; font-weight: bold; text-align: center; padding: 15px 20px; border-radius: 5px;">${content[3]}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Info Text -->
                                <tr>
                                    <td style="color: #ffffff; font-size: 16px; padding: 10px 40px;">
                                        <p>If you did not request this verification code, please disregard this email.</p>
                                        <p>Thank you for choosing Tow Naija!</p>
                                    </td>
                                </tr>

                                <!-- Closing -->
                                <tr>
                                    <td style="color: #F2D41E; font-size: 16px; font-weight: bold; padding: 10px 40px;">
                                        Best Regards, <br> <span style="color: #F2D41E;">Tow Naija Team.</span>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td align="center" style="padding: 5px, 31px, 0px, 0px;">
                                        <hr style="border: 0; height: 1px; background-color: #ffffff; width: 80%;">
                                    </td>
                                </tr>

                                <!-- Social Icons -->
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <!-- Instagram Icon -->
                                        <a href="#" style="text-decoration: none; margin-right: 10px;">
                                          <img src="cid:instagram" alt="Logo" style="max-width: 100px; height: auto;">
                                        </a>
                                        <!-- Facebook Icon -->
                                        <a href="#" style="text-decoration: none;">
                                           <img src="cid:facebook" alt="Logo" style="max-width: 100px; height: auto;">
                                        </a>
                                    </td>
                                </tr>

                                <!-- Divider -->
                                <tr>
                                    <td align="center" style="padding: 5px, 31px, 0px, 0px;">
                                        <hr style="border: 0; height: 1px; background-color: #ffffff; width: 80%;">
                                    </td>
                                </tr>

                                <!-- Footer -->
                                <tr>
                                    <td align="center" style="color: #ffffff; font-size: 12px; padding: 10px 40px;">
                                        © 2024 Tow Naija. All rights reserved.
                                    </td>
                                </tr>

                                <!-- Unsubscribe & Legal -->
                                <tr>
                                    <td align="center" style="color: #ffffff; font-size: 12px; padding: 10px 40px;">
                                        <p>You are receiving this email because you registered to join the Tow Naija platform as a user or a creator. This also shows that you agree to our <a href="#" style="color: #ffc107;">Terms of use</a> and <a href="#" style="color: #ffc107;">Privacy Policies</a>. If you no longer want to receive emails from us, click the unsubscribe link below.</p>
                                        <p>
                                            <a href="#" style="color: #F2D41E;">Privacy policy</a> |
                                            <a href="#" style="color: #F2D41E;">Terms of service</a> |
                                            <a href="#" style="color: #F2D41E;">Help center</a> |
                                            <a href="#" style="color: #F2D41E;">Unsubscribe</a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
          `,
          attachments: [
            {
              filename: 'logo.png',
              content: fs.readFileSync('./src/assets/towLogo.png'),
              cid: 'logo'
            },
            {
              filename: 'instagram.png',
              content: fs.readFileSync('./src/assets/instagram.png'),
              cid: 'instagram'
            },
            {
                filename: 'facebook.png',
                content: fs.readFileSync('./src/assets/facebook.png'),
                cid: 'facebook'
            }
           ]
          };
        case 'newsletter':
          return{html: `<div><h1>Newsletter</h1><p>${content}</p></div>`, attachments: []};
        case 'security':
          return{html:`<div><h1>Security Alert</h1><p>${content}</p></div>`, attachments: []};
        case 'welcome':
          return {
            html: `
            <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Tow Naija Account</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #021639; font-family: Arial, sans-serif; color: #ffffff;">
                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                            <td align="center">
                                <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #021639; padding: 20px;">
                                    <!-- Logo -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                            <img src="cid:logo" alt="Logo" style="max-width: 100px; height: auto;">                           
                                        </td>
                                    </tr>
                                    
                                    <!-- Header Text -->
                                    <tr>
                                        <td align="center" style="color: #F2D41E; font-size: 20px; font-weight: bold; padding-bottom: 20px;">
                                            Welcome to the future of Towing Vehicles!
                                        </td>
                                    </tr>

                                    <!-- Greeting -->
                                    <tr>
                                        <td style="color: #ffffff; font-size: 16px; padding: 10px 40px;">
                                            <p>Dear <strong>${content}</strong>,</p>
                                            <p>Welcome to Tow Naija, your reliable partner for towing services in Nigeria!</p>
                                        </td>
                                    </tr>


                                    <!-- Info Text -->
                                    <tr>
                                        <td style="color: #ffffff; font-size: 16px; padding: 10px 40px;">
                                            <p>We're excited to have you on board. Our platform connects you with a network of </p>
                                            <p>trusted tow vehicle operators, ensuring a seamless experience whenever you need </p>
                                            <p>assistance.</p>
                                        </td>
                                    </tr>

                                    <!-- Closing -->
                                    <tr>
                                        <td style="color: #F2D41E; font-size: 16px; font-weight: bold; padding: 10px 40px;">
                                            Best Regards, <br> <span style="color: #F2D41E;">Tow Naija Team.</span>
                                        </td>
                                    </tr>

                                    <!-- Divider -->
                                    <tr>
                                        <td align="center" style="padding: 31px, 5px, 0px, 0px;">
                                            <hr style="border: 0; height: 1px; background-color: #ffffff; width: 80%;">
                                        </td>
                                    </tr>

                                    <!-- Social Icons -->
                                    <tr>
                                        <td align="center" style="padding-bottom: 20px;">
                                        <!-- Instagram Icon -->
                                        <a href="#" style="text-decoration: none; margin-right: 10px;">
                                            <img src="cid:instagram" alt="Logo" style="max-width: 100px; height: auto;">
                                        </a>
                                        <!-- Facebook Icon -->
                                        <a href="#" style="text-decoration: none;">
                                            <img src="cid:facebook" alt="Logo" style="max-width: 100px; height: auto;">
                                        </a>
                                        </td>
                                    </tr>

                                    <!-- Divider -->
                                    <tr>
                                        <td align="center" style="padding: 5px, 31px, 0px, 0px;">
                                            <hr style="border: 0; height: 1px; background-color: #ffffff; width: 80%;">
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td align="center" style="color: #ffffff; font-size: 12px; padding: 10px 40px;">
                                            © 2024 Tow Naija. All rights reserved.
                                        </td>
                                    </tr>

                                    <!-- Unsubscribe & Legal -->
                                    <tr>
                                        <td align="center" style="color: #ffffff; font-size: 12px; padding: 10px 40px;">
                                            <p>You are receiving this email because you registered to join the Tow Naija platform as a user or a creator. This also shows that you agree to our <a href="#" style="color: #ffc107;">Terms of use</a> and <a href="#" style="color: #ffc107;">Privacy Policies</a>. If you no longer want to receive emails from us, click the unsubscribe link below.</p>
                                            <p>
                                                <a href="#" style="color: #F2D41E;">Privacy policy</a> |
                                                <a href="#" style="color: #F2D41E;">Terms of service</a> |
                                                <a href="#" style="color: #F2D41E;">Help center</a> |
                                                <a href="#" style="color: #F2D41E;">Unsubscribe</a>
                                            </p>
                                        </td>
                                    </tr>

                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
          `,
          attachments: [
            {
                filename: 'logo.png',
                content: fs.readFileSync('./src/assets/towLogo.png'),
                cid: 'logo'
              },
              {
                filename: 'instagram.png',
                content: fs.readFileSync('./src/assets/instagram.png'),
                cid: 'instagram'
              },
              {
                  filename: 'facebook.png',
                  content: fs.readFileSync('./src/assets/facebook.png'),
                  cid: 'facebook'
              }
           ]
        }
        default:
          return{html:`<div><p>${content}</p></div>`, attachments: []}; // Fallback for general messages
      }
    }
  }