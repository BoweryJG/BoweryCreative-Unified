-- Medical Aesthetics Campaign Templates
-- Dental Implant Campaigns

INSERT INTO campaigns (
  name,
  description,
  category,
  preview_content,
  ai_prompt_template,
  base_price,
  credits_included,
  success_rate,
  industry,
  use_case,
  example_subject_lines,
  example_email_preview,
  compliance_approved,
  channel_type,
  specialty_tags,
  personalization_vars,
  is_active
) VALUES 
-- Smile Transformation Journey
(
  'Smile Transformation Journey',
  'Comprehensive welcome series for new dental implant consultations with education and trust-building content',
  'Healthcare',
  'Multi-email series guiding patients through the implant process',
  'Create a warm, educational email for {patient_name} who recently inquired about dental implants. Address their concerns about {main_concern}, highlight the benefits of modern implant technology, and invite them to schedule a consultation. Practice name: {practice_name}. Doctor name: {doctor_name}.',
  75.00,
  30,
  87.5,
  'Dental',
  'New patient education and consultation booking',
  jsonb_build_array(
    '{patient_name}, Your Smile Transformation Starts Here',
    'The Truth About Dental Implants (What You Need to Know)',
    'Why {practice_name} Patients Love Their New Smiles'
  ),
  'Dear {patient_name},

Thank you for your interest in dental implants at {practice_name}. We understand that replacing missing teeth is an important decision, and we''re here to guide you every step of the way.

Did you know that modern dental implants have a 95% success rate and can last a lifetime with proper care? 

Here''s what makes our implant process special:
• Personalized treatment planning
• Advanced 3D imaging technology  
• Experienced implant specialists
• Comfortable, caring environment

We''d love to discuss how dental implants can restore your confidence and improve your quality of life.

[Schedule Your Free Consultation]

Warmly,
Dr. {doctor_name} and the {practice_name} Team',
  true,
  'email',
  ARRAY['dental-implants', 'restorative', 'consultations'],
  '{"patient_name": "string", "main_concern": "string", "practice_name": "string", "doctor_name": "string"}'::jsonb,
  true
),

-- YOMI Robotic Surgery Advantage
(
  'YOMI Robotic Surgery Advantage',
  'Highlight cutting-edge robotic implant technology for tech-savvy patients seeking precision',
  'Healthcare',
  'Showcase YOMI robotic-assisted surgery benefits',
  'Write a professional email for {patient_name} highlighting our YOMI robotic dental implant system. Emphasize precision, same-day procedures, minimal invasiveness, and faster healing. Include statistics about accuracy. Practice: {practice_name}.',
  85.00,
  25,
  91.2,
  'Dental',
  'Technology differentiation and premium positioning',
  jsonb_build_array(
    'Experience the Future: Robotic Dental Implant Surgery',
    '{patient_name}, See How Robotics Makes Implants Better',
    'Why Top Dentists Choose YOMI Robotic Surgery'
  ),
  'Dear {patient_name},

At {practice_name}, we''re proud to be among the first practices offering YOMI robotic-assisted dental implant surgery.

What does this mean for you?

🎯 **Unmatched Precision**: YOMI provides accuracy within 0.1mm
⏱️ **Same-Day Procedures**: Plan and place implants in one visit
💉 **Minimally Invasive**: Smaller incisions mean faster healing
😌 **Enhanced Comfort**: Reduced surgery time and trauma

The YOMI system combines your CT scan with real-time surgical guidance, ensuring your implant is placed exactly where planned - every time.

Ready to experience the gold standard in implant dentistry?

[Book Your Robotic Surgery Consultation]

Best regards,
The {practice_name} Team',
  true,
  'email',
  ARRAY['dental-implants', 'robotic-surgery', 'technology', 'premium'],
  '{"patient_name": "string", "practice_name": "string"}'::jsonb,
  true
),

-- Injectable Aesthetics Campaigns
-- Refresh & Rejuvenate Botox Campaign
(
  'Refresh & Rejuvenate - Botox Special',
  'Seasonal Botox/Dysport promotion targeting existing patients and new prospects',
  'Healthcare',
  'Compliant injectable promotion with education',
  'Create a compliant promotional email for {patient_name} about our injectable special. Mention Botox/Dysport for wrinkle reduction. Include safety information and emphasize natural results. Offer: {special_offer}. Practice: {practice_name}. Injector: {injector_name}.',
  65.00,
  25,
  88.7,
  'Medical Spa',
  'Injectable promotions and education',
  jsonb_build_array(
    'Ready to Refresh Your Look, {patient_name}?',
    'Limited Time: Expert Injector Special',
    'The Secret to Natural-Looking Results'
  ),
  'Hello {patient_name},

Spring is the perfect time to refresh your appearance with our expert injectable treatments at {practice_name}.

**This Month''s Special**: {special_offer}

Why patients choose us:
• Board-certified injectors with artistic expertise
• Natural-looking results that enhance YOUR features
• Complimentary consultations to design your treatment plan
• FDA-approved products only (Botox®, Dysport®, Xeomin®)

Our approach focuses on subtle enhancements that leave you looking refreshed, not "done."

Treatment areas include:
- Forehead lines
- Crow''s feet  
- Frown lines
- And more!

Ready to love what you see in the mirror?

[Book Your Complimentary Consultation]

{injector_name}
Lead Injector, {practice_name}

*Results may vary. Prescription treatments require medical consultation.',
  true,
  'email',
  ARRAY['injectables', 'botox', 'aesthetics', 'anti-aging'],
  '{"patient_name": "string", "special_offer": "string", "practice_name": "string", "injector_name": "string"}'::jsonb,
  true
),

-- Lip Love Valentine's Special
(
  'Lip Love Holiday Special',
  'Dermal filler campaign for lips and facial volume - perfect for holidays',
  'Healthcare',
  'Holiday-themed filler promotion',
  'Write a fun, engaging email for {patient_name} about our lip filler special for {holiday}. Focus on natural enhancement, mention Juvederm/Restylane options, include safety info. Special: {special_offer}. Practice: {practice_name}.',
  70.00,
  20,
  85.3,
  'Medical Spa',
  'Holiday promotions for dermal fillers',
  jsonb_build_array(
    'Get Kiss-Ready for {holiday}! 💋',
    '{patient_name}, Your Perfect Pout Awaits',
    'Limited Spots: {holiday} Lip Special'
  ),
  'Hi {patient_name}!

{holiday} is approaching, and we have the perfect gift for yourself - gorgeous, natural-looking lips! 💕

**{holiday} Special**: {special_offer}

At {practice_name}, we specialize in creating beautiful, balanced results with:
• Juvederm® Ultra & Volbella
• Restylane® Kysse
• RHA® Collection

What sets us apart:
✨ Natural enhancement (no "duck lips" here!)
✨ Comfort-focused techniques
✨ Experienced, artistic injectors
✨ Complimentary touch-ups if needed

Whether you want subtle volume or more defined lips, we''ll create a custom treatment plan just for you.

Limited appointments available!

[Reserve Your {holiday} Transformation]

XOXO,
The {practice_name} Team

*Individual results vary. Medical consultation required.',
  true,
  'email',
  ARRAY['dermal-fillers', 'lips', 'holiday-promotion', 'aesthetics'],
  '{"patient_name": "string", "holiday": "string", "special_offer": "string", "practice_name": "string"}'::jsonb,
  true
),

-- CoolSculpting Summer Body Campaign
(
  'CoolSculpting Summer Body',
  'Body contouring campaign for non-invasive fat reduction',
  'Healthcare',
  'Seasonal body contouring promotion',
  'Create an motivating email for {patient_name} about CoolSculpting for summer body goals. Highlight non-invasive nature, FDA-cleared technology, treatment areas, and results timeline. Include {special_offer}. Practice: {practice_name}.',
  80.00,
  30,
  82.5,
  'Medical Spa',
  'Body contouring and fat reduction',
  jsonb_build_array(
    'Still Time for Your Summer Body, {patient_name}!',
    'Freeze Away Stubborn Fat (No Surgery Required)',
    'CoolSculpting Event: Exclusive Savings Inside'
  ),
  'Hi {patient_name},

Ready to feel confident in your summer wardrobe? CoolSculpting® can help you achieve the body you want - without surgery, needles, or downtime!

**Limited Time Offer**: {special_offer}

CoolSculpting® is FDA-cleared to eliminate stubborn fat in 9 areas:
• Abdomen & flanks
• Inner & outer thighs
• Bra fat & back fat
• Upper arms
• Under the chin
• Under the jawline

How it works:
❄️ Freezes fat cells naturally
📉 Reduces fat by up to 25% per treatment
⏰ 35-minute sessions
🏃 No downtime - return to activities immediately

Most patients see results in 6-12 weeks!

Ready to sculpt your ideal silhouette?

[Schedule Your CoolSculpting Consultation]

Stay cool,
{practice_name}

*Results and patient experience may vary.',
  true,
  'email',
  ARRAY['coolsculpting', 'body-contouring', 'non-invasive', 'fat-reduction'],
  '{"patient_name": "string", "special_offer": "string", "practice_name": "string"}'::jsonb,
  true
),

-- Microneedling Glow Up Campaign
(
  'Microneedling Glow Up Series',
  'Skin rejuvenation campaign for texture, tone, and anti-aging',
  'Healthcare',
  'Microneedling education and promotion',
  'Write an educational email for {patient_name} about microneedling benefits for skin rejuvenation. Cover RF microneedling, PRP options, conditions treated. Mention {special_offer}. Practice: {practice_name}. Provider: {provider_name}.',
  75.00,
  25,
  86.8,
  'Medical Spa',
  'Skin rejuvenation and anti-aging',
  jsonb_build_array(
    'Get Your Glow Back with Microneedling',
    '{patient_name}, Transform Your Skin Texture',
    'The Secret to Celebrity Skin Revealed'
  ),
  'Dear {patient_name},

If you''re looking for smoother, firmer, more radiant skin, microneedling at {practice_name} might be your answer!

**What Microneedling Can Do:**
✓ Reduce fine lines and wrinkles
✓ Improve acne scars and large pores  
✓ Even out skin tone and texture
✓ Boost collagen production naturally
✓ Enhance product absorption

**Our Advanced Options:**
• Traditional Microneedling
• RF Microneedling (Morpheus8/Vivace)
• Microneedling with PRP (Vampire Facial)
• Microneedling with growth factors

**Special Offer**: {special_offer}

Most patients see improvements after just one treatment, with optimal results after a series.

Ready to reveal your best skin?

[Book Your Microneedling Consultation]

Glowingly yours,
{provider_name}
{practice_name}',
  true,
  'email',
  ARRAY['microneedling', 'skin-rejuvenation', 'anti-aging', 'acne-scars'],
  '{"patient_name": "string", "special_offer": "string", "practice_name": "string", "provider_name": "string"}'::jsonb,
  true
),

-- VIP Membership Benefits Campaign
(
  'VIP Membership Exclusive Benefits',
  'Loyalty program campaign to increase retention and recurring revenue',
  'Healthcare',
  'Membership program promotion',
  'Create an exclusive email for {patient_name} about our VIP membership program. Highlight savings, perks, exclusive access. Monthly fee: {membership_fee}. Benefits list: {benefits_list}. Practice: {practice_name}.',
  60.00,
  20,
  92.3,
  'Medical Spa',
  'Loyalty and membership programs',
  jsonb_build_array(
    '{patient_name}, You''re Invited to Join Our VIP Club',
    'Unlock Exclusive Savings (Members Only)',
    'Your VIP Access Awaits'
  ),
  'Dear {patient_name},

As a valued patient of {practice_name}, you''re invited to join our exclusive VIP Membership program!

**For just {membership_fee}/month, you''ll receive:**
{benefits_list}

**Additional VIP Perks:**
🌟 Priority booking
🌟 Exclusive member events
🌟 First access to new treatments
🌟 Birthday surprise
🌟 Referral rewards program

Our VIP members save an average of $2,400 per year!

Limited memberships available to maintain our exclusive experience.

[Secure Your VIP Membership]

Welcome to the inner circle,
{practice_name} Team',
  true,
  'email',
  ARRAY['membership', 'loyalty', 'retention', 'vip'],
  '{"patient_name": "string", "membership_fee": "string", "benefits_list": "string", "practice_name": "string"}'::jsonb,
  true
),

-- Treatment Reminder Series
(
  'Treatment Reminder & Maintenance',
  'Automated reminder campaign for treatment maintenance and rebooking',
  'Healthcare',
  'Maintenance appointment reminders',
  'Write a friendly reminder email for {patient_name} who had {last_treatment} {time_since} ago. Suggest maintenance schedule, mention any current specials. Next recommended appointment: {recommended_date}. Practice: {practice_name}.',
  50.00,
  40,
  94.1,
  'Medical Spa',
  'Patient retention and rebooking',
  jsonb_build_array(
    '{patient_name}, Time for Your {last_treatment} Touch-Up',
    'Maintain Your Beautiful Results',
    'We Miss You! Special Offer Inside'
  ),
  'Hi {patient_name}!

It''s been {time_since} since your last {last_treatment} treatment, and we wanted to check in!

To maintain your beautiful results, we recommend scheduling your next appointment around {recommended_date}.

**Why timing matters:**
• Optimal results with consistent treatments
• Prevent starting from scratch
• Often requires less product = more savings
• Keep that refreshed, youthful look

As a returning patient, you''ll receive priority booking and any current specials.

Ready to maintain your glow?

[Book Your Appointment]

Looking forward to seeing you soon!
{practice_name}

P.S. Running low on skincare? Order refills online!',
  true,
  'email',
  ARRAY['reminders', 'retention', 'maintenance', 'rebooking'],
  '{"patient_name": "string", "last_treatment": "string", "time_since": "string", "recommended_date": "string", "practice_name": "string"}'::jsonb,
  true
);