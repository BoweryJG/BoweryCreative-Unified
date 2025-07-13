-- Sample Campaign Data
-- Run this AFTER creating the tables

INSERT INTO campaigns (
  name, 
  description, 
  category, 
  preview_content, 
  ai_prompt_template, 
  success_rate, 
  industry, 
  use_case, 
  example_subject_lines, 
  example_email_preview
) VALUES 
(
  'New Patient Welcome Series',
  'Automated welcome emails for new medical practice patients',
  'Healthcare',
  'Welcome new patients with a warm, professional email series that builds trust and encourages appointment booking.',
  'Create a warm, professional welcome email for a new patient named {name} at {practice_name}. Mention their upcoming appointment on {date} and highlight 3 key benefits of choosing our practice. Keep tone friendly but professional.',
  85.5,
  'Medical',
  'Onboarding new patients',
  jsonb_build_array(
    'Welcome to {practice_name}, {name}!',
    'Your Health Journey Starts Here',
    'Everything You Need to Know Before Your First Visit'
  ),
  'Dear {name}, Welcome to {practice_name}! We are thrilled to have you as our newest patient and look forward to partnering with you on your health journey...'
),
(
  'Appointment Reminder Campaign',
  'Reduce no-shows with friendly appointment reminders',
  'Healthcare',
  'Send timely reminders that reduce no-shows by 40% on average.',
  'Write a friendly appointment reminder for {name} who has an appointment on {date} at {time} with Dr. {doctor}. Include parking instructions and what to bring. Add a personal touch.',
  92.0,
  'Medical',
  'Appointment management',
  jsonb_build_array(
    'Dont Forget: Your Appointment Tomorrow',
    'See You Soon, {name}!',
    'Quick Reminder About Your Visit'
  ),
  'Hi {name}, Just a friendly reminder about your appointment tomorrow at {time} with Dr. {doctor}. We are looking forward to seeing you!...'
),
(
  'Win-Back Inactive Patients',
  'Re-engage patients who havent visited in 6+ months',
  'Healthcare',
  'Bring back 30% of inactive patients with personalized win-back campaigns.',
  'Create a win-back email for {name} who last visited {months_ago} months ago. Mention new services, extended hours, or special offers. Express that we miss them and care about their health.',
  68.5,
  'Medical',
  'Patient retention',
  jsonb_build_array(
    'We Miss You, {name}!',
    'Its Time for Your Check-up',
    'Special Offer for Returning Patients'
  ),
  'Dear {name}, We noticed it has been a while since your last visit, and we wanted to check in. Your health is important to us...'
),
(
  'Seasonal Health Campaign',
  'Promote flu shots, health screenings, and seasonal services',
  'Healthcare',
  'Drive seasonal service bookings with timely health campaigns.',
  'Write an email promoting {seasonal_service} to {name}. Emphasize the importance of preventive care, mention limited appointment availability, and include a clear call-to-action to book online or call.',
  78.0,
  'Medical',
  'Preventive care promotion',
  jsonb_build_array(
    'Flu Season is Here - Protect Yourself',
    'Time for Your Annual Health Screening',
    'Spring Into Better Health'
  ),
  'Hi {name}, With flu season approaching, now is the perfect time to get your flu shot. We have appointments available...'
),
(
  'Professional Referral Outreach',
  'Build referral relationships with other healthcare providers',
  'Healthcare',
  'Expand your referral network with targeted outreach to fellow professionals.',
  'Compose a professional referral introduction email from Dr. {your_name} to Dr. {recipient_name}. Briefly introduce the practice, highlight specialties, and suggest mutual referral opportunities. Keep it concise and professional.',
  45.5,
  'Medical',
  'B2B networking',
  jsonb_build_array(
    'Exploring Referral Partnership Opportunities',
    'Connecting Healthcare Professionals',
    'Introduction from Dr. {your_name}'
  ),
  'Dear Dr. {recipient_name}, I hope this email finds you well. I am reaching out to introduce myself and explore potential collaboration...'
);