const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Verify Your Email - Varkari Sampraday</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000;">
  <!-- Top Banner (Mauli1.png) -->
  <img 
    src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743849911/Mauli1_nbjquf.png" 
    alt="Mauli Banner" 
    style="width: 100%; height: auto; display: block;"
  />

  <!-- Card with Background & Content -->
  <div style="max-width: 100%; margin: -30px auto 0; padding: 30px 20px; border-radius: 30px; background-image: url('https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850127/Background_rfoblq.png'); background-size: cover; background-position: center; background-repeat: no-repeat; box-shadow: 0 4px 20px rgba(0,0,0,0.4); color: #fff;">

    <!-- Overlay for darkness like BlurView -->
    <div style="background-color: rgba(0, 0, 0, 0.6); border-radius: 30px; padding: 30px;">

      <!-- Logo inside card -->
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850193/iconbg_mtnck2.png" alt="Mauli Logo" style="width: 100px; height: auto; margin-bottom: 10px;" />
        <h1 style="color: #FFD700; font-size: 28px; margin: 10px 0;">Jai Hari Mauli!</h1>
        <h2 style="color: #fff; font-size: 20px; margin: 0;">Welcome to Varkari Sampraday</h2>
      </div>

      <!-- Email Content -->
      <p style="margin-top: 30px;">Namaskar Warkari Bandhavnno,</p>
      <p>Thank you for joining our spiritual community through the Varkari Sampraday Application. Please use the following code to verify your email and begin your journey with us:</p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; letter-spacing: 6px; background: linear-gradient(to right, #FFD700, #FFA500); color: #000; border-radius: 8px;">
          {verificationCode}
        </span>
      </div>

      <p>This code is valid for <strong>1 minute</strong>. Please do not share it with anyone.</p>
      <p>If this wasn't you, feel free to ignore this email.</p>

      <p style="margin-top: 30px;">May Vitthal Mauli bless your journey with devotion, peace, and connection.</p>
      <p>~ Varkari Sampraday Team</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #666;" />
      <p style="font-size: 12px; text-align: center; color: #ccc;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Reset Your Password - Varkari Sampraday</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000;">

  <!-- Top Banner -->
  <div style="position: relative; text-align: center;">
    <img 
      src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743849911/Mauli1_nbjquf.png" 
      alt="Mauli Banner" 
      style="width: 100%; height: auto; display: block; "
    />
    <!-- Overlayed Logo (simulating blur) -->
     </div>

  <!-- Content Card -->
  <div style="max-width: 100%; margin: 60px auto 0; padding: 30px 20px; border-radius: 30px; background-image: url('https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850127/Background_rfoblq.png'); background-size: cover; background-position: center; background-repeat: no-repeat; box-shadow: 0 4px 20px rgba(0,0,0,0.4); color: #fff;">
    <div style="background-color: rgba(0, 0, 0, 0.65); border-radius: 30px; padding: 30px;">
<!-- Logo inside card -->
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850193/iconbg_mtnck2.png" alt="Mauli Logo" style="width: 100px; height: auto; margin-bottom: 10px;" />
        </div>
      <!-- Greeting -->
      <div style="text-align: center; margin-top: 40px;">
        <h1 style="color: #FFD700; font-size: 28px; margin: 10px 0;">Jai Hari Mauli!</h1>
        <h2 style="color: #fff; font-size: 20px; margin: 0;">Reset Your Password</h2>
      </div>

      <p style="margin-top: 30px;">Namaskar Mauli,</p>
      <p>We received a request to reset your password on the <strong>Varkari Sampraday Application</strong>. If this wasn't you, please ignore this email.</p>
      <p>To continue your spiritual journey securely, use the following code to verify your email and help you with reset password</p>

      <!-- Email Content -->
      <p style="margin-top: 30px;">Namaskar Warkari Bandhavnno,</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 15px 30px; font-size: 28px; font-weight: bold; letter-spacing: 6px; background: linear-gradient(to right, #FFD700, #FFA500); color: #000; border-radius: 8px;">
          {verificationCode}
        </span>
      </div>
      <p style="margin-top: 30px;">May Vitthal Mauli bless your journey with devotion, peace, and connection.</p>
      <p>~ Varkari Sampraday Team</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #666;" />
      <p style="font-size: 12px; text-align: center; color: #ccc;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;
const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Password Reset Successful - Varkari Sampraday</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #000;">

  <!-- Top Banner -->
  <div style="position: relative; text-align: center;">
    <img 
      src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743849911/Mauli1_nbjquf.png" 
      alt="Mauli Banner" 
      style="width: 100%; height: auto; display: block;"
    />
    <!-- Overlayed Logo -->
     </div>

  <!-- Content Card -->
  <div style="max-width: 100%; margin: 60px auto 0; padding: 30px 20px; border-radius: 30px; background-image: url('https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850127/Background_rfoblq.png'); background-size: cover; background-position: center; background-repeat: no-repeat; box-shadow: 0 4px 20px rgba(0,0,0,0.4); color: #fff;">
    <div style="background-color: rgba(0, 0, 0, 0.65); border-radius: 30px; padding: 30px;">
<!-- Logo inside card -->
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/dtxcatfdq/image/upload/v1743850193/iconbg_mtnck2.png" alt="Mauli Logo" style="width: 100px; height: auto; margin-bottom: 10px;" />
              </div>
      <div style="text-align: center; margin-top: 40px;">
        <h1 style="color: #FFD700; font-size: 28px; margin: 10px 0;">Jai Hari Mauli!</h1>
        <h2 style="color: #fff; font-size: 20px; margin: 0;">Password Reset Successful</h2>
        <div style="background-color: #28a745; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px; margin-top: 20px;">✓</div>
      </div>

      <p style="margin-top: 30px;">Namaskar Warkari Bandhu,</p>
      <p>Your password has been successfully updated.</p>
      <p>If this wasn't done by you, please contact our support team immediately.</p>

      <p>For a secure experience on your spiritual journey, we recommend:</p>
      <ul style="color: #fff; padding-left: 20px;">
        <li>Using a strong and unique password</li>
        <li>Keeping your device secure</li>
         </ul>

      <p>May your path in both the digital and spiritual worlds remain blessed and protected.</p>
      <p>~ Varkari Sampraday Team</p>

      <hr style="margin: 40px 0; border: none; border-top: 1px solid #666;" />
      <p style="font-size: 12px; text-align: center; color: #ccc;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE }